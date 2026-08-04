// backend/eslint.config.mjs
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
  // build.js and other root .js scripts are plain CommonJS, outside the
  // project's tsconfig (src/**/*.ts), and must not be touched (see CLAUDE.md).
  globalIgnores(['dist/**', 'node_modules/**', '*.js']),
  {
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    },
  },
);
