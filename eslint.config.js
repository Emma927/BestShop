import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist', 'node_modules']),
    {
        files: ['**/*.js'], // wszystkie pliki JS
        ignores: ['dist/**', 'node_modules/**'], // dodatkowe ignorowanie
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
            'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }], // ostrzeżenie dla nieużywanych zmiennych
            'no-console': 'off', // pozwala używać console.log
            'prettier/prettier': 'warn', // wymusza styl Prettiera
        },
    },
]);