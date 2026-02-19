# Implementação da Aba de Instituição e Branding em PDFs

## Visão Geral
Foi implementada a aba de configurações da Instituição e atualizada a geração de todos os documentos PDF do sistema para refletir a identidade visual da escola (Logo, Nome, CNPJ, Telefone).

## Alterações Realizadas

### 1. Aba de Instituição (`InstitutionTab.tsx`)
- Implementada a interface para cadastro de dados da instituição.
- Adicionada visualização em tempo real (Preview) de como o cabeçalho ficará nos documentos.
- Integração com Supabase para salvar/carregar dados da tabela `Escolas`.
- Upload de Logo funcional.

### 2. Integração com Configurações (`SettingsView.tsx`)
- A aba "Instituição" foi integrada ao painel de ajustes.
- Visível para usuários vinculados a uma escola (`escola_id`) OU Administradores da plataforma.
- **Melhoria:** Administradores sem vínculo direto com uma escola agora podem selecionar qual instituição desejam configurar através de um menu suspenso.

### 3. Padronização de PDFs
Todos os módulos geradores de PDF foram atualizados para consumir os dados da instituição:

#### A. Relatórios Gerais e Individuais (`ReportsView.tsx`)
- **Cabeçalho:** Exibe Logo da escola.
- **Rodapé:** Adicionado Nome da Escola, Telefone e CNPJ centralizados.
- **Copyright:** Atualizado para refletir a instituição.

#### B. Lista de Alunos (`StudentsView.tsx`)
- **Cabeçalho:** Adicionado Nome da Escola em destaque, logo e detalhes de contato (CNPJ/Tel).
- **Rodapé:** Padronizado com os dados da instituição.

#### C. Agenda e Cronogramas (`AgendaView.tsx`)
- **Cabeçalho:** Adicionado Logo e Nome da Escola no cronograma semanal.
- **Rodapé:** Padronizado com branding institucional.

#### D. PEIs (`PEIsTab.tsx`)
- Já estava alinhado, verificado que consome os mesmos dados da tabela `Escolas`.

## Como Testar
1. Acesse o menu **Ajustes > Instituição**.
2. Faça upload de uma logo e preencha os dados (Nome, CNPJ, Telefone).
3. Verifique o "Preview" em tempo real na mesma tela.
4. Salve as alterações.
5. Navegue para **Alunos**, **Agenda** ou **Relatórios** e gere um PDF.
6. O documento gerado conterá a identidade visual configurada.
