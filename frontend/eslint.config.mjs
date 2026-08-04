import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Same properties Stylelint already forbids as hardcoded in .css,
    // but Stylelint only scans .css, so a
    // style={{ fontSize: '...' }} in JSX went unnoticed.
    // Does not apply to opengraph-image.tsx/icon.tsx: they render via
    // next/og (Satori) to produce a static image, with no access to
    // globals.css/tokens, raw px there is the only way to write it.
    ignores: ["**/opengraph-image.tsx", "**/twitter-image.tsx", "**/icon.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "JSXAttribute[name.name='style'] Property[key.name=/^(fontSize|margin\\w*|padding\\w*|gap|rowGap|columnGap)$/][value.type='Literal']:not([value.value=0])",
          message:
            "Valor hardcoded de font-size/margin/padding/gap em style inline — use uma classe CSS com token (--sp-*/--type-*) em vez de literal aqui (CLAUDE.md §5).",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone debug scripts (CommonJS, run directly via `node`), outside
    // the Next.js build, don't follow the app's ESM/TS module rules.
    "scripts/**",
  ]),
]);

export default eslintConfig;
