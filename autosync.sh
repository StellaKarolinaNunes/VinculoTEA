#!/bin/bash

# ---------------------------------------------------------------------------
# Script: Auto-Sync Profissional (GitHub -> Vercel)
# Descrição: Monitoramento inteligente com Conventional Commits Automáticos
# ---------------------------------------------------------------------------

# Configurações
INTERVALO=180  
BRANCH="main"

# Cores e Formatação
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # Sem cor

clear
echo -e "${BLUE}${BOLD}====================================================${NC}"
echo -e "${CYAN}${BOLD} VERCEL AUTO-DEPLOY MONITOR (INTELIGENTE)${NC}"
echo -e "${BLUE}${BOLD}====================================================${NC}"
echo -e "${BOLD}Status:${NC}    ${GREEN}● Ativo${NC}"
echo -e "${BOLD}Intervalo:${NC} ${YELLOW}${INTERVALO}s${NC}"
echo -e "${BOLD}Branch:${NC}    ${MAGENTA}${BRANCH}${NC}"
echo -e "${BLUE}----------------------------------------------------${NC}"

while true; do
  # Prepara as mudanças
  git add .
  
  # Verifica se tem o que commitar
  if ! git diff-index --quiet HEAD; then
    HORA=$(date "+%H:%M:%S")
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    
    # 1. Detectar arquivos alterados para decidir o prefixo
    CHANGED_FILES=$(git diff --cached --name-only)
    FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l)
    
    PREFIX="chore" # Padrão
    
    if echo "$CHANGED_FILES" | grep -qE "docs/|.*\.md$"; then
      PREFIX="docs"
    elif echo "$CHANGED_FILES" | grep -qE "styles/|.*\.css$"; then
      PREFIX="style"
    elif echo "$CHANGED_FILES" | grep -qE "test/|tests/|.*\.test\..*|.*\.spec\..*"; then
      PREFIX="test"
    elif echo "$CHANGED_FILES" | grep -qE "src/|App\.tsx|index\.tsx"; then
      # Tenta distinguir feat de refactor
      if git status --porcelain | grep -q "^A "; then
        PREFIX="feat"
      else
        PREFIX="refactor"
      fi
    fi

    # 2. Construir mensagem informativa
    MAIN_FILE=$(echo "$CHANGED_FILES" | head -n 1)
    if [ "$FILE_COUNT" -gt 1 ]; then
      DESC="update $MAIN_FILE and $(expr $FILE_COUNT - 1) other files"
    else
      DESC="update $MAIN_FILE"
    fi
    
    COMMIT_MSG="$PREFIX: $DESC "
    
    echo -e "[$HORA] ${YELLOW}${BOLD} MUDANÇAS DETECTADAS!${NC}"
    echo -e "[$HORA] ${CYAN} Arquivos:${NC} ${FILE_COUNT} alterado(s)"
    echo -e "[$HORA] ${BLUE} Commit:${NC} ${BOLD}${COMMIT_MSG}${NC}"
    
    # Commit com corpo detalhado
    git commit -m "$COMMIT_MSG" -m "Automated sync at $TIMESTAMP" -m "Files modified:
$CHANGED_FILES" > /dev/null
    
    echo -e "[$HORA] ${CYAN} Enviando para GitHub...${NC}"
    if git push origin $BRANCH > /dev/null 2>&1; then
      echo -e "[$HORA] ${GREEN}${BOLD} SUCESSO!${NC} Deploy disparado na Vercel."
    else
      echo -e "[$HORA] ${RED}${BOLD} ERRO!${NC} Falha ao enviar para o GitHub."
    fi
    echo -e "${BLUE}----------------------------------------------------${NC}"
  else
    HORA=$(date "+%H:%M:%S")
    echo -ne "[$HORA] ${NC} Standby: Nenhuma alteração encontrada...\\r"
  fi
  
  sleep $INTERVALO
done