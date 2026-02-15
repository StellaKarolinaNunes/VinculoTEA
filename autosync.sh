#!/bin/bash

# ---------------------------------------------------------------------------
# Script: Auto-Sync Profissional (GitHub -> Vercel)
# Descrição: Monitoramento de mudanças com Conventional Commits
# ---------------------------------------------------------------------------

# Configurações
INTERVALO=180 # 3 minutos para evitar cancelamentos excessivos na Vercel
BRANCH="main"

# Cores para o Terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # Sem cor

clear
echo -e "${BLUE}====================================================${NC}"
echo -e "${CYAN}🚀 VERCEL AUTO-DEPLOY MONITOR${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "Status: ${GREEN}Ativo${NC}"
echo -e "Intervalo: ${YELLOW}${INTERVALO}s${NC}"
echo -e "Branch: ${YELLOW}${BRANCH}${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

while true; do
  # Verifica mudanças no diretório
  git add .
  
  if ! git diff-index --quiet HEAD; then
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    HORA=$(date "+%H:%M:%S")
    
    # Mensagem de Commit Profissional
    # Usamos 'chore' para automações de sincronização
    COMMIT_MSG="chore(deploy): auto-sync at $TIMESTAMP [skip ci]"
    
    echo -e "[$HORA] ${YELLOW}📦 Mudanças detectadas!${NC}"
    echo -e "[$HORA] ${BLUE}📝 Committing:${NC} $COMMIT_MSG"
    
    git commit -m "$COMMIT_MSG" > /dev/null
    
    echo -e "[$HORA] ${CYAN}📤 Enviando para GitHub...${NC}"
    git push origin $BRANCH > /dev/null 2>&1
    
    echo -e "[$HORA] ${GREEN}✅ Deploy disparado na Vercel!${NC}"
    echo -e "${BLUE}----------------------------------------------------${NC}"
  else
    HORA=$(date "+%H:%M:%S")
    echo -e "[$HORA] ${NC}😴 Standby: Nenhuma alteração encontrada.${NC}"
  fi
  
  sleep $INTERVALO
done