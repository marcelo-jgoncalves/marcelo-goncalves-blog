// backend/build.js
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const functions = ['getPost', 'getAuthor', 'imageProcessor', 'adminPosts', 'mediaUpload', 'getPosts', 'adminAuthors', 'postScheduler', 'adminCategorias', 'adminSession', 'adminAuthorizer'];
async function build() {
  const rootDir = path.resolve(__dirname, '..');
  const infraBuildsDir = path.join(rootDir, 'infra', 'builds');
  const backendDistDir = path.join(__dirname, 'dist'); 

  if (!fs.existsSync(infraBuildsDir)) fs.mkdirSync(infraBuildsDir, { recursive: true });
  if (!fs.existsSync(backendDistDir)) fs.mkdirSync(backendDistDir, { recursive: true });

  for (const func of functions) {
    console.log(`\n🔨 Building ${func}...`);
    
    const funcDistDir = path.join(backendDistDir, func);
    // Limpa pasta anterior para evitar lixo
    if (fs.existsSync(funcDistDir)) fs.rmSync(funcDistDir, { recursive: true, force: true });
    fs.mkdirSync(funcDistDir, { recursive: true });

    // 1. Transpilação (TS -> JS)
    await esbuild.build({
      entryPoints: [`src/functions/${func}/index.ts`],
      bundle: true,
      minify: true,
      platform: 'node',
      target: 'node20',
      format: 'cjs',
      outfile: path.join(funcDistDir, 'index.js'),
      // O 'sharp' é externo porque vamos instalá-lo manualmente
      // O '@aws-sdk' é externo porque já existe na Lambda
      external: ['@aws-sdk/*', 'sharp'], 
    });

    // 2. Tratamento especial para o Sharp (Instalar binários Linux)
    if (func === 'imageProcessor') {
        console.log(`🐧 Installing Linux binaries for Sharp...`);
        // Cria um package.json temporário para instalar apenas o sharp
        fs.writeFileSync(
            path.join(funcDistDir, 'package.json'),
            JSON.stringify({ dependencies: { sharp: "^0.35.3" } }) // CVEs de libvips corrigidos (>=0.35.0)
        );
        
        // Instala especificamente para Linux x64
        execSync('npm install --os=linux --cpu=x64 --omit=dev', { cwd: funcDistDir });
    }

    // 3. Zipagem
    const zipName = `${func}.zip`;
    const zipOutput = path.join(infraBuildsDir, zipName);
    
    try {
        if (fs.existsSync(zipOutput)) fs.unlinkSync(zipOutput);
        console.log(`📦 Zipping to ${zipOutput}...`);
        if (process.platform === 'win32') {
            execSync(`powershell -Command "Compress-Archive -Path '${funcDistDir}\\*' -DestinationPath '${zipOutput}' -Force"`);
        } else {
            // Normaliza timestamps para ZIP determinístico — Terraform só atualiza a Lambda se o código mudar
            execSync(`find "${funcDistDir}" -exec touch -t 202001010000.00 {} \\; && zip -rX -q "${zipOutput}" .`, { cwd: funcDistDir });
        }
    } catch (error) {
        console.error(`❌ Erro ao zipar ${func}:`, error);
        process.exit(1);
    }
  }
  console.log('\n✅ Build complete!');
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});