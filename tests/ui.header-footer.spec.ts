// tests/ui.header-footer.spec.ts
import { test, expect, Page } from '@playwright/test';

const BASE_URL   = process.env.BASE_URL ?? 'http://localhost:3000';
const E2E_EMAIL  = process.env.E2E_EMAIL!;
const E2E_PASS   = process.env.E2E_PASSWORD!;
const DEBUG_NET  = process.env.DEBUG_E2E_NETWORK === '1';

const SEL = {
  header: 'header[aria-label="site-header"]',
  footer: 'footer[aria-label="site-footer"]',
  navPrimary: 'nav[aria-label="primary"]',
  navMobile: 'nav[aria-label="モバイルナビゲーション"]',
  loginLink: 'a[aria-label="ログインページへ"]',
  signupLink: 'a[aria-label="会員登録ページへ"]',
  notifyBtn: 'button[aria-label="お知らせ"]',
  avatarButton: '[role="button"][aria-haspopup="menu"]',
  homeRoot: '[data-testid="home-root"]',
  loginRoot: '[data-testid="login-root"]',
};

async function goto(page: Page, path: string) {
  const url = new URL(path, BASE_URL).toString();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
}

function attachNetworkDebug(page: Page) {
  if (!DEBUG_NET) return;
  page.on('request', req => console.log('REQ', req.method(), req.url()));
  page.on('requestfailed', req => console.log('REQ-FAILED', req.method(), req.url(), req.failure()?.errorText));
  page.on('response', res => console.log('RES', res.status(), res.request().method(), res.url()));
}

// /home に到達していなければ明示遷移して安定化
async function ensureHome(page: Page) {
  const ok = await expect(page).toHaveURL(/\/home(?:$|[?#])/, { timeout: 3000 }).catch(() => null);
  if (!ok) await goto(page, '/home');
  await page.waitForSelector(SEL.homeRoot, { timeout: 15000 });
}

// UI経由を試し、失敗なら API 直ログイン → /home へ確実に到達
async function uiLogin(page: Page) {
  attachNetworkDebug(page);

  await goto(page, '/login');
  await page.waitForSelector(SEL.loginRoot);

  await page.fill('#email', E2E_EMAIL);
  await page.fill('#password', E2E_PASS);

  const submit = page.getByRole('button', { name: 'ログインする' });
  await expect(submit).toBeVisible();
  await expect(submit).toBeEnabled();

  // UIクリック: /login POST を見張る（来なくても続行）
  void page
    .waitForResponse(
      res => /\/(api\/)?login\b/.test(new URL(res.url()).pathname) && res.request().method() === 'POST',
      { timeout: 5000 }
    )
    .catch(() => null);

  await submit.click();

  // UI経由で /api/me = 200 を待つ（失敗したら fallback）
  const meOkUi = await page
    .waitForResponse(
      res => new URL(res.url()).pathname.endsWith('/api/me') && res.status() === 200,
      { timeout: 10000 }
    )
    .catch(() => null);

  if (!meOkUi) {
    // Fallback: CSRF → XSRF → /login をページ内 fetch で実行
    await page.evaluate(async ({ apiBase, email, password }) => {
      const csrf = await fetch(`${apiBase}/sanctum/csrf-cookie`, { credentials: 'include' });
      if (!csrf.ok) throw new Error('csrf-cookie failed: ' + csrf.status);
      const xsrf = decodeURIComponent(
        (document.cookie.split('; ').find(c => c.startsWith('XSRF-TOKEN=')) || '').split('=')[1] || ''
      );
      if (!xsrf) throw new Error('XSRF token not found');
      const loginRes = await fetch(`${apiBase}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrf,
        },
        body: JSON.stringify({ email, password }),
      });
      if (!loginRes.ok) {
        const t = await loginRes.text().catch(() => '');
        throw new Error(`login failed: ${loginRes.status} ${t}`);
      }
    }, { apiBase: 'https://api.richpassapp.com', email: E2E_EMAIL, password: E2E_PASS });

    // Fallback 直後の /api/me = 200 を保証
    const meOkApi = await page
      .waitForResponse(
        res => new URL(res.url()).pathname.endsWith('/api/me') && res.status() === 200,
        { timeout: 20000 }
      )
      .catch(() => null);
    if (!meOkApi) throw new Error('`/api/me`=200 に到達せず。CORS/Cookie/CSRF を確認してください。');
  }

  // ここで URL が /home になっていない端末幅があったため、確実に /home へ
  await ensureHome(page);
}

test.describe('Header/Footer/BottomNav behavior', () => {
  // ------- Logged OUT -------
  test('PC (logged-out): header shows login/signup, footer has legal links, no mobile nav', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 1280, height: 900 });

    await goto(page, '/login');
    await expect(page.locator(SEL.header)).toBeVisible();
    await expect(page.locator(SEL.loginLink)).toBeVisible();
    await expect(page.locator(SEL.signupLink)).toBeVisible();
    await expect(page.locator(SEL.navPrimary)).toHaveCount(0);
    await expect(page.locator(SEL.footer)).toBeVisible();
    await expect(page.getByRole('link', { name: '利用規約' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'プライバシーポリシー' })).toBeVisible();
    await expect(page.locator(SEL.navMobile)).toHaveCount(0);
  });

  test('Mobile (logged-out): header shows login/signup, footer has legal links, no mobile nav', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 375, height: 800 });

    await goto(page, '/login');
    await expect(page.locator(SEL.header)).toBeVisible();
    await expect(page.locator(SEL.loginLink)).toBeVisible();
    await expect(page.locator(SEL.signupLink)).toBeVisible();
    await expect(page.locator(SEL.navPrimary)).toHaveCount(0);
    await expect(page.locator(SEL.footer)).toBeVisible();
    await expect(page.getByRole('link', { name: '利用規約' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'プライバシーポリシー' })).toBeVisible();
    await expect(page.locator(SEL.navMobile)).toHaveCount(0);
  });

  // ------- Logged IN -------
  test('PC (logged-in): header has primary nav, bell & avatar; footer visible; no mobile nav', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 1280, height: 900 });

    await uiLogin(page);
    await expect(page.locator(SEL.header)).toBeVisible();
    await expect(page.locator(SEL.navPrimary)).toBeVisible();
    await expect(page.locator(SEL.notifyBtn)).toBeVisible();
    await expect(page.locator(SEL.avatarButton)).toBeVisible();
    await expect(page.locator(SEL.footer)).toBeVisible();
    await expect(page.locator(SEL.navMobile)).toHaveCount(0);
  });

  test('Tablet (logged-in): primary nav visible; footer visible; no mobile nav', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 1024, height: 900 });

    await uiLogin(page);
    await expect(page.locator(SEL.header)).toBeVisible();
    await expect(page.locator(SEL.navPrimary)).toBeVisible();
    await expect(page.locator(SEL.footer)).toBeVisible();
    await expect(page.locator(SEL.navMobile)).toHaveCount(0);
  });

  test('Mobile (logged-in): primary nav hidden; mobile tabbar visible; footer hidden', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 375, height: 800 });

    await uiLogin(page);
    await expect(page.locator(SEL.navPrimary)).toBeHidden();
    await expect(page.locator(SEL.navMobile)).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/has-tabbar/);
    await expect(page.locator(SEL.footer)).toHaveCount(0);
  });
});
