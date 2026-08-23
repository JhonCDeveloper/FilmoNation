import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import query from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  // 1. Configuraciones globales base
  js.configs.recommended,
  reactRefresh.configs.vite,
  jsxA11y.flatConfigs.recommended,
  query.configs['flat/recommended'],

  // 2. React Hooks para ESLint 10
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // 3. Reglas estrictas de TypeScript aplicadas exclusivamente a src/
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // 4. ── REGLAS DE ARQUITECTURA LIMPIA ─────────────────────────────────────
  // Axios encapsulado únicamente en infraestructura HTTP (regla base para todo src)
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/infrastructure/http/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: 'Solo src/infrastructure/http puede importar axios.',
            },
          ],
        },
      ],
    },
  },

  // Dominio
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-*', 'axios', '@tanstack/*', 'react-hook-form'],
              message: 'El dominio no depende de frameworks.',
            },
            {
              group: ['@/presentation/*', '@/infrastructure/*', '@/application/*'],
              message: 'Las dependencias apuntan hacia dentro.',
            },
          ],
        },
      ],
    },
  },

  // Aplicación
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/presentation/*', '@/infrastructure/*'],
              message:
                'La aplicación define interfaces; la infraestructura las implementa, no al revés.',
            },
            {
              group: ['axios', 'react', 'react-*'],
              message: 'La aplicación no sabe cómo viajan los datos.',
            },
          ],
        },
      ],
    },
  },

  // 5. Excepciones para tests
  {
    files: ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // 6. Prettier al final
  prettier,
]);
