import { chromium } from 'playwright';

const CODE = '452E-D533';

const browser = await chromium.launch({ headless: false }); // ユーザーが確認できるよう表示
const page = await browser.newPage();

console.log('GitHubデバイス認証ページを開いています...');
await page.goto('https://github.com/login/device', { waitUntil: 'networkidle' });

// コード入力欄を探して入力
const codeInput = await page.$('input[name="user-code"], input[id="user-code"], input[autocomplete="one-time-code"], input[placeholder*="XXXX"]');
if (codeInput) {
  await codeInput.fill(CODE);
  console.log(`コード ${CODE} を入力しました`);
  await page.waitForTimeout(500);

  // 「Continue」または「Verify」ボタンをクリック
  const continueBtn = await page.$('button[type="submit"], input[type="submit"]');
  if (continueBtn) {
    await continueBtn.click();
    console.log('Continueボタンをクリックしました');
    await page.waitForTimeout(2000);
  }
} else {
  console.log('コード入力欄が見つかりません。手動で入力してください');
}

// 認証ボタンを探してクリック
try {
  await page.waitForSelector('button:has-text("Authorize"), input[value*="Authorize"]', { timeout: 10000 });
  await page.click('button:has-text("Authorize"), input[value*="Authorize"]');
  console.log('Authorizeボタンをクリックしました');
  await page.waitForTimeout(3000);
} catch {
  console.log('Authorizeボタンが見つからないか、すでに処理済みです');
}

const currentUrl = page.url();
console.log('現在のURL:', currentUrl);
await page.screenshot({ path: 'auth-result.png' });
console.log('スクリーンショット: auth-result.png');

await browser.close();
