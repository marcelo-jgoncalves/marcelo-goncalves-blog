const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const functions = ['getPost', 'getAuthor', 'imageProcessor', 'adminPosts', 'mediaUpload', 'getPosts', 'adminAuthors', 'postScheduler', 'adminCategories', 'adminSession', 'adminAuthorizer', 'postCounterReconciler'];
async function build() {
  const rootDir = path.resolve(__dirname, '..');
  const infraBuildsDir = path.join(rootDir, 'infra', 'builds');
  const backendDistDir = path.join(__dirname, 'dist'); 

  if (!fs.existsSync(infraBuildsDir)) fs.mkdirSync(infraBuildsDir, { recursive: true });
  if (!fs.existsSync(backendDistDir)) fs.mkdirSync(backendDistDir, { recursive: true });

  for (const func of functions) {
    console.log(`\n🔨 Building ${func}...`);
    
    const funcDistDir = path.join(backendDistDir, func);
    // Clear the previous output so stale files never leak into a new build
    if (fs.existsSync(funcDistDir)) fs.rmSync(funcDistDir, { recursive: true, force: true });
    fs.mkdirSync(funcDistDir, { recursive: true });

    await esbuild.build({
      entryPoints: [`src/functions/${func}/index.ts`],
      bundle: true,
      minify: true,
      platform: 'node',
      target: 'node24',
      format: 'cjs',
      outfile: path.join(funcDistDir, 'index.js'),
      // 'sharp' is external because it's installed separately below (needs Linux binaries).
      // The AWS SDK is bundled (not external): relying on the runtime's built-in
      // version ties production behavior to whatever SDK version AWS ships that
      // month, drifting from package-lock.json/tests/what's actually built here.
      external: ['sharp'],
    });

    if (func === 'imageProcessor') {
        console.log(`🐧 Installing Linux binaries for Sharp...`);
        // Pinned exact version + committed lockfile (backend/lambda-dependencies) so every
        // build resolves the same Sharp/libvips binaries via `npm ci`, not a version range.
        const lambdaDepsDir = path.join(__dirname, 'lambda-dependencies');
        fs.copyFileSync(path.join(lambdaDepsDir, 'package.json'), path.join(funcDistDir, 'package.json'));
        fs.copyFileSync(path.join(lambdaDepsDir, 'package-lock.json'), path.join(funcDistDir, 'package-lock.json'));

        execSync('npm ci --os=linux --cpu=x64 --omit=dev', { cwd: funcDistDir });
    }

    const zipName = `${func}.zip`;
    const zipOutput = path.join(infraBuildsDir, zipName);
    
    try {
        if (fs.existsSync(zipOutput)) fs.unlinkSync(zipOutput);
        console.log(`📦 Zipping to ${zipOutput}...`);
        if (process.platform === 'win32') {
            execSync(`powershell -Command "Compress-Archive -Path '${funcDistDir}\\*' -DestinationPath '${zipOutput}' -Force"`);
        } else {
            // Normalize timestamps for a deterministic ZIP: Terraform only updates the Lambda when the code hash changes
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