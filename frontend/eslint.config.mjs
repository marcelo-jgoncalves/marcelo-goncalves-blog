import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Mesmas propriedades que o Stylelint já proíbe hardcoded em .css
    // (CLAUDE.md §5) — mas o Stylelint só varre .css, então um
    // style={{ fontSize: '...' }} em JSX passava despercebido (achado
    // real em busca/page.tsx na sessão 48 e em contato/page.tsx depois).
    // Não se aplica a opengraph-image.tsx/icon.tsx: são renderizados via
    // next/og (Satori) para gerar uma imagem estática, sem acesso ao
    // globals.css/tokens do app — px cru ali é o único jeito de escrever.
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
    // Scripts de debug standalone (CommonJS, rodados via `node` direto —
    // fora do build do Next, não seguem as regras de módulo ESM/TS do app).
    "scripts/**",
  ]),
]);

export default eslintConfig;
