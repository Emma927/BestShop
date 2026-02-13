import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist', 'node_modules']),
    {
        files: ['**/*.js'], // all JS file
        ignores: ['dist/**', 'node_modules/**'], // additional ignores
        extends: [js.configs.recommended, 'prettier'], // ESLint + Prettier
        plugins: ['prettier'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: 'readonly',
                window: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }], // warning for unused variables
            'no-console': 'off', // allows using console.log
            'prettier/prettier': 'warn', // enforces Prettier style
        },
    },
]);