# autosync.sh
while true; do
  git add .
  # Só faz o commit se houver mudanças
  if ! git diff-index --quiet HEAD; then
    git commit -m "auto-sync: $(date)"
    git push origin main
    echo "✅ Código enviado ao GitHub e Vercel às $(date)"
  else
    echo "⟳ Nenhuma mudança detectada. Aguardando..."
  fi
  sleep 60
done