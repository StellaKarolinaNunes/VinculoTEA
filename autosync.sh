#!/bin/bash

# Script de Sincronização Automática com Vercel (via GitHub)
# Intervalo: 60 segundos
# 
# AVISO: A Vercel cancela builds anteriores se um novo chegar antes do fim.
# Se continuar vendo "Canceled", aumente o sleep para 180 (3 minutos).

echo "🔄 Iniciando Auto-Sync a cada 60 segundos..."

while true; do
  # Sincroniza arquivos
  git add .
  
  # Verifica se tem mudanças
  if ! git diff-index --quiet HEAD; then
    TIMESTAMP=$(date "+%H:%M:%S")
    echo "[$TIMESTAMP] 📦 Mudanças detectadas! Commitando..."
    
    git commit -m "auto-deploy: $TIMESTAMP"
    git push origin main
    
    echo "[$TIMESTAMP] ✅ Enviado para GitHub! O deploy na Vercel deve iniciar."
  else
    echo "😴 Nenhuma alteração detectada."
  fi
  
  # Aguarda 1 minuto
  sleep 60
done