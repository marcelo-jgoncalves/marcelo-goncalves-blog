// backend/eslint.config.mjs
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
  // build.js e demais scripts .js da raiz: CommonJS puro (ver CLAUDE.md
  // "build.js... Não alterar"), fora do tsconfig do projeto (src/**/*.ts).
  globalIgnores(['dist/**', 'node_modules/**', '*.js']),
  {
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    },
  },
);
