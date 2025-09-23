import { test, expect, Page } from '@playwright/test';

async function login(page: Page, email: string, password: string) {
  // 1) /login へ
  await page.goto('/login');

  // 2) 入力（ラベル厳密指定）
  await page.getByLabel('メールアドレス', { exact: true }).fill(email);
  await page.getByLabel('パスワード',    { exact: true }).fill(password);

  // 3) 送信
  await page.click('button[type="submit"]');

  // 4) セッション確立の兆候を待つ（/api/me 200 の発生を待つ）※無くても続行
  await page.waitForResponse(
    (r) => r.url().endsWith('/api/me') && r.status() === 200,
    { timeout: 15_000 }
  ).catch(() => { /* 稀に観測できないケースはフォールバックで吸収 */ });

  // 5) 念のため /home を明示遷移（SPAレースを回避）
  await page.goto('/home');

  // 6) 安定要素で合否判定：home-root or login-root のどちらが出るか
  const homeRoot = page.getByTestId('home-root');
  const loginRoot = page.getByTestId('login-root');

  // どちらかが先に見えた方で判定（最大 15 秒）
  const winner = await Promise.race([
    homeRoot.waitFor({ timeout: 15_000 }).then(() => 'home'),
    loginRoot.waitFor({ timeout: 15_000 }).then(() => 'login'),
  ]);

  if (winner !== 'home') {
    throw new Error('login failed: redirected back to /login');
  }

  // 7) /home の要素も確認（任意）
  await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '学習を続けましょう！' })).toBeVisible();
}

test('未ログインで /home → /login にリダイレクト', async ({ page }) => {
  await page.goto('/home');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId('login-root')).toBeVisible();
});

test('正常ログインで /home に到達し UI 要素が表示される', async ({ page }) => {
  await login(page, 'test@richpassapp.com', 'Passw0rd!');
});

test('ログアウト → /home 直アクセスで /login', async ({ page }) => {
  // 事前ログイン
  await login(page, 'test@richpassapp.com', 'Passw0rd!');

  // ログアウト → /login を安定要素で確認
  await page.getByRole('button', { name: 'ログアウト' }).click();
  await page.getByTestId('login-root').waitFor({ timeout: 15_000 });

  // /home 直アクセス → /login へ戻されることを確認
  await page.goto('/home');
  await expect(page.getByTestId('login-root')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
