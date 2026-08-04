// backend/eslint.config.mjs
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
  // build.js and other root .js scripts are plain CommonJS, outside the
  // project's tsconfig (src/**/*.ts), and must not be touched (see CLAUDE.md).
  globalIgnores(['dist/**', 'node_modules/**', '*.js']),
  {
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    },
  },
  {
    // jest.fn()/mockResolvedValue return `any` by design (that's what makes
    // them usable as a stand-in for any AWS SDK response shape): typing every
    // mock call site would add ceremony without catching real bugs, since
    // nothing here reaches production. Full type safety stays enforced on
    // src/**/*.ts (the code that actually runs in Lambda).
    files: ['src/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);
