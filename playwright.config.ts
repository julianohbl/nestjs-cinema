import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test', // Diretório dos testes
  testMatch: '**/*.spec.ts', // Apenas arquivos com esse padrão serão executados
  use: {
    baseURL: 'http://localhost:3000', // URL base da API
    trace: 'on', // Habilita rastreamento para debugging
  },
  reporter: [
    ['dot'], // Exibe o resultado no console
    ['allure-playwright'], // Gera o relatório Allure
  ],
});
