#!/usr/bin/env bash
# scripts/build-placeholders.sh
# Cria ZIPs placeholder em infra/builds/ para que o terraform plan não quebre
# na leitura de filebase64sha256. O conteúdo real vem do CI/CD.
# Executar a partir da raiz do monorepo.

set -euo pipefail

mkdir -p infra/builds

LAMBDAS=(
  getPost
  getPosts
  getAuthor
  adminPosts
  adminAuthors
  adminCategorias
  mediaUpload
  postScheduler
  imageProcessor
)

echo "==> Criando ZIPs placeholder em infra/builds/"

for name in "${LAMBDAS[@]}"; do
  zip_path="infra/builds/${name}.zip"
  if [ ! -f "$zip_path" ]; then
    echo "   console.log('placeholder');" > /tmp/index.js
    (cd /tmp && zip -q "${OLDPWD}/${zip_path}" index.js && rm index.js)
    echo "    [ok] ${zip_path}"
  else
    echo "    [skip] ${zip_path} já existe"
  fi
done

# Next.js zip
if [ ! -f "infra/builds/nextjs.zip" ]; then
  echo "   exports.handler = async () => ({ statusCode: 200, body: 'placeholder' });" > /tmp/index.mjs
  (cd /tmp && zip -q "${OLDPWD}/infra/builds/nextjs.zip" index.mjs && rm index.mjs)
  echo "    [ok] infra/builds/nextjs.zip"
else
  echo "    [skip] infra/builds/nextjs.zip já existe"
fi

echo ""
echo "==> Placeholders criados. Execute agora:"
echo "    cd infra && terraform plan -var-file=env/dev.tfvars"
