// scripts/optimize-static-images.mjs
//
// Gera variantes AVIF/WebP (1x/2x) dos assets estáticos de /sobre (badges de
// certificação e logos de empresas/universidades) a partir dos originais
// preservados em assets-source/, escrevendo o resultado em
// frontend/public/static/{badges,logos}/. Não toca no pipeline de upload
// (imageProcessor) — esses arquivos não vêm de upload de usuário, são parte
// do código-fonte do site, e por isso são otimizados em build-time, uma vez,
// não em runtime.
//
// Mesmas escolhas de qualidade do imageProcessor (backend/src/functions/
// imageProcessor/index.ts) para consistência visual entre os dois pipelines:
// AVIF quality 65 (effort 2), WebP quality 80.

import sharp from "sharp";
import { readFile, writeFile, mkdir, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, "../assets-source");
const DEST_ROOT = path.resolve(__dirname, "../frontend/public/static");

// width/height de exibição real em CSS (ver app/sobre/sobre.css,
// components/ui/CertificacoesWidget.css) — a variante "1x" é exportada
// exatamente nesse tamanho, "2x" no dobro, para telas retina.
const MANIFEST = {
  badges: {
    dimension: "width",
    // maior valor de exibição real entre .sobre-cert-badge (64px) e
    // .certs-widget__badge (80px) — um único par 1x/2x cobre os dois usos.
    size1x: 80,
    files: ["pactitioner", "solutions", "splunk", "sysops", "terraform"],
  },
  logos: {
    dimension: "height",
    // .sobre-tc-logo varia 42-72px de altura (nth-child) — 72px é o maior.
    size1x: 72,
    files: ["accenture-logo", "anynines-logo", "credisis-logo", "deutsche-bahn-logo"],
  },
  "logos-tile": {
    // .sobre-acad-tile: caixa 68x68 com padding 10px (~48px de área visível)
    // — exportado um pouco maior que a área visível mínima para folga.
    dimension: "width",
    size1x: 56,
    outputDir: "logos",
    files: ["estacio-logo", "potsdam-logo", "ufmg-logo"],
  },
};

async function generateVariant(inputBuffer, resizeOpts, format, quality, outPath) {
  const buffer = await sharp(inputBuffer)
    .resize({ ...resizeOpts, withoutEnlargement: true })
    .toFormat(format, {
      quality,
      ...(format === "avif" && { effort: 2 }),
    })
    .toBuffer();
  await writeFile(outPath, buffer);
  return buffer.length;
}

async function processGroup(groupName, group) {
  const sourceDir = path.join(SOURCE_ROOT, groupName.replace("-tile", ""));
  const destDir = path.join(DEST_ROOT, group.outputDir ?? groupName);
  await mkdir(destDir, { recursive: true });

  for (const name of group.files) {
    const srcPath = path.join(sourceDir, `${name}.png`);
    const inputBuffer = await readFile(srcPath);

    for (const [densityLabel, multiplier] of [["1x", 1], ["2x", 2]]) {
      const resizeOpts = { [group.dimension]: group.size1x * multiplier };

      const avifBytes = await generateVariant(
        inputBuffer, resizeOpts, "avif", 65,
        path.join(destDir, `${name}-${densityLabel}.avif`),
      );
      const webpBytes = await generateVariant(
        inputBuffer, resizeOpts, "webp", 80,
        path.join(destDir, `${name}-${densityLabel}.webp`),
      );

      console.log(`${groupName}/${name}-${densityLabel}: avif=${avifBytes}B webp=${webpBytes}B`);
    }
  }
}

async function main() {
  for (const [groupName, group] of Object.entries(MANIFEST)) {
    await processGroup(groupName, group);
  }
  console.log("\nConcluído. Originais preservados em assets-source/.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
