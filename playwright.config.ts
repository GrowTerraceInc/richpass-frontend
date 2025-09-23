import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  use: {
    baseURL: process.env.FRONT_ORIGIN ?? 'https://local.richpassapp.com:3001',
    headless: true,
  },
});
