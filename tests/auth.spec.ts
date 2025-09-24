import { test, expect, Page } from '@playwright/test';

/** 各テストの冒頭で「絶対に真っさらにする」 */
test.beforeEach(async ({ page }) => {
  // Cookieを全消去（.richpassapp.com / local.richpassapp.com 含む）
  await page.context().clearCookies();

  // StorageとCacheも念のためクリア（SPA遷移の揺れを抑制）
  await page.addInitScript(() => {
    try {
      window.localStorage?.clear?.();
      window.sessionStorage?.clear?.();
      // Cache Storage（対応ブラウザのみ）
      (async () => {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
      })();
    } catch {}
  });
});

/** ログイン共通関数：セッション確立→/home強制→安定要素待ち */
async function login(page: Page, email: string, password: string) {
  // 1) /login へ（確実にログイン画面から開始）
  await page.goto('/login');
  await expect(page.getByTestId('login-root')).toBeVisible();

  // 2) 入力（ラベル厳密）
  await page.getByLabel('メールアドレス', { exact: true }).fill(email);
  await page.getByLabel('パスワード',    { exact: true }).fill(password);

  // 3) 送信
  await page.click('button[type="submit"]');

  // 4) /api/me の 200 を観測（発生しなくても次へ進む）
  await page.waitForResponse(
    (r) => r.url().endsWith('/api/me') && r.status() === 200,
    { timeout: 15_000 }
  ).catch(() => { /* 観測できないケースはフォールバックで吸収 */ });

  // 5) 念のため /home を明示遷移（SPAレース吸収）
  await page.goto('/home');

  // 6) 安定要素で合否判定（どちらが先に出るか）
  const homeRoot = page.getByTestId('home-root');
  const loginRoot = page.getByTestId('login-root');
  const winner = await Promise.race([
    homeRoot.waitFor({ timeout: 15_000 }).then(() => 'home'),
    loginRoot.waitFor({ timeout: 15_000 }).then(() => 'login'),
  ]);
  if (winner !== 'home') throw new Error('login failed: redirected back to /login');

  // 7) /homeのUIも軽く確認
  await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '学習を続けましょう！' })).toBeVisible();
}

test('未ログインで /home → /login にリダイレクト', async ({ page }) => {
  await page.goto('/home');
  // SPAリダイレクトはURLよりtestidで待つほうが堅牢
  await expect(page.getByTestId('login-root')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('正常ログインで /home に到達し UI 要素が表示される', async ({ page }) => {
  await login(page, 'test@richpassapp.com', 'Passw0rd!');
});

test('ログアウト → /home 直アクセスで /login', async ({ page }) => {
  await login(page, 'test@richpassapp.com', 'Passw0rd!');

  // ログアウト → login-root を待つ
  await page.getByRole('button', { name: 'ログアウト' }).click();
  await page.getByTestId('login-root').waitFor({ timeout: 15_000 });

  // /home 直アクセス → /login に戻される
  await page.goto('/home');
  await expect(page.getByTestId('login-root')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
