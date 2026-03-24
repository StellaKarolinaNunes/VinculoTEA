-- SECURITY REMEDIATION MIGRATION (2026-03-24)
-- This migration implements Defense in Depth, MTI Isolation, and CID Encryption.

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS pgsodium;

-- 1. Secure Access Functions (Imutáveis via JWT app_metadata)
CREATE OR REPLACE FUNCTION public.get_auth_plataforma_id() 
RETURNS integer 
LANGUAGE sql 
STABLE 
SET search_path = public
AS $$
  SELECT ((auth.jwt() -> 'app_metadata') ->> 'plataforma_id')::integer;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_role() 
RETURNS text 
LANGUAGE sql 
STABLE 
SET search_path = public
AS $$
  SELECT ((auth.jwt() -> 'app_metadata') ->> 'role')::text;
$$;

-- 2. CID Encryption Infrastructure (PG_SODIUM)
-- Criamos uma tabela para armazenar os dados criptografados se necessário, 
-- mas aqui usaremos a abordagem de Transparent Column Encryption se disponível, 
-- ou triggers para pgsodium.

-- Para fins desta remediação, usaremos uma criptografia baseada no ID do Aluno como nonce.
CREATE OR REPLACE FUNCTION public.encrypt_cid(plain_text text, student_id int)
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pgsodium
AS $$
DECLARE
    secret_key bytea;
    encrypted bytea;
BEGIN
    IF plain_text IS NULL OR plain_text = '' THEN RETURN NULL; END IF;
    
    -- Busca ou cria chave de criptografia para a plataforma (simplificado para demo)
    -- Em produção, deve-se usar o Vault do Supabase
    encrypted := pgsodium.crypto_aead_det_encrypt(
        decode(encode(plain_text::bytea, 'hex'), 'hex'),
        decode(encode(student_id::text, 'hex'), 'hex'),
        1 -- Key ID (deve ser gerenciado via pgsodium.key)
    );
    
    RETURN encode(encrypted, 'base64');
END;
$$;

-- 3. Hardening RLS - Multi-tenant Isolation (MTI)
-- Aplicar em todas as tabelas principais

DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('Alunos', 'Professores', 'Escolas', 'Familias', 'Acompanhamentos', 'Anotacoes', 'PEIs', 'Agenda', 'Turmas', 'Disciplinas')
    LOOP
        -- Habilitar RLS
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        
        -- Remover políticas antigas e inseguras (permisivas)
        EXECUTE format('DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Public access" ON public.%I', t);
        
        -- Criar Política de Isolamento por Plataforma (Multi-tenant)
        EXECUTE format('
            CREATE POLICY "MTI_Isolation_%s" ON public.%I
            FOR ALL
            TO authenticated
            USING ("Plataforma_ID" = public.get_auth_plataforma_id())
            WITH CHECK ("Plataforma_ID" = public.get_auth_plataforma_id())
        ', t, t);
    END LOOP;
END $$;

-- 4. RBAC - Restrições por Role
-- Apenas Administradores e Gestores podem deletar alunos ou escolas
DROP POLICY IF EXISTS "RBAC_Delete_Alunos" ON public."Alunos";
CREATE POLICY "RBAC_Delete_Alunos" ON public."Alunos"
FOR DELETE TO authenticated
USING (
  "Plataforma_ID" = public.get_auth_plataforma_id() AND 
  public.get_auth_role() IN ('Administrador', 'GESTOR')
);

-- 5. Auditoria de Acesso (LGPD)
CREATE TABLE IF NOT EXISTS public.logs_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    usuario_id UUID DEFAULT auth.uid(),
    plataforma_id INTEGER DEFAULT public.get_auth_plataforma_id(),
    acao TEXT NOT NULL,
    tabela TEXT,
    registro_id TEXT,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address TEXT DEFAULT current_setting('request.headers', true)::jsonb->>'x-real-ip'
);

ALTER TABLE public.logs_auditoria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins_can_view_logs" ON public.logs_auditoria
FOR SELECT TO authenticated
USING (
    plataforma_id = public.get_auth_plataforma_id() AND
    public.get_auth_role() = 'Administrador'
);
