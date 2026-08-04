// scripts/optimize-static-images.mjs
//
// Generates AVIF/WebP variants (1x/2x) of the static assets from /sobre
// (certification badges and company/university logos) from the originals
// preserved in assets-source/, writing the result to
// frontend/public/static/{badges,logos}/. Does not touch the upload
// pipeline (imageProcessor): these files do not come from user upload, they
// are part of the site's source code, so they are optimized at build time,
// once, not at runtime.
//
// Same quality choices as imageProcessor (backend/src/functions/
// imageProcessor/index.ts) for visual consistency between the two
// pipelines: AVIF quality 65 (effort 2), WebP quality 80.

import sharp from "sharp";
import { readFile, writeFile, mkdir, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(__dirname, "../assets-source");
const DEST_ROOT = path.resolve(__dirname, "../frontend/public/static");

// Real display width/height in CSS (see app/sobre/sobre.css,
// components/ui/CertificacoesWidget.css): the "1x" variant is exported at
// exactly that size, "2x" at double, for retina screens.
const MANIFEST = {
  badges: {
    dimension: "width",
    // Largest real display value between .sobre-cert-badge (64px) and
    // .certs-widget__badge (80px): a single 1x/2x pair covers both uses.
    size1x: 80,
    files: ["pactitioner", "solutions", "splunk", "sysops", "terraform"],
  },
  logos: {
    dimension: "height",
    // .sobre-tc-logo ranges 42-72px in height (nth-child); 72px is the largest.
    size1x: 72,
    files: ["accenture-logo", "anynines-logo", "credisis-logo", "deutsche-bahn-logo"],
  },
  "logos-tile": {
    // .sobre-acad-tile: 68x68 box with 10px padding (~48px visible area),
    // exported slightly larger than the minimum visible area for slack.
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
