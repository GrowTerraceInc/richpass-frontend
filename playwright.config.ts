// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  use: {
    baseURL: process.env.BASE_URL || 'https://local.richpassapp.com:3001',
    ignoreHTTPSErrors: true,             // ← 自己署名HTTPSを許可
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 900 }
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
