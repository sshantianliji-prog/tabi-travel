import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const CHROME_PROFILE = 'C:\\Users\\aya18\\AppData\\Local\\Google\\Chrome\\User Data';

const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
  channel: 'chrome',
  headless: false,
  args: ['--profile-directory=Default'],
  timeout: 15000,
}).catch(async () => {
  // Chromeもダメならヘッドレスで新規起動
  console.log('プロフィール起動失敗。新規Chromeで起動します...');
  return null;
});

if (!browser) {
  console.log('FALLBACK: 新規ブラウザで起動');
  process.exit(2);
}

const page = await browser.newPage();
console.log('GitHubのトークン作成ページを開いています...');

try {
  await page.goto('https://github.com/settings/tokens/new', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
} catch (e) {
  await page.screenshot({ path: 'pat-error.png' });
  console.log('ページ遷移エラー:', e.message);
  await browser.close();
  process.exit(1);
}

const url = page.url();
console.log('現在のURL:', url.substring(0, 80));
await page.screenshot({ path: 'pat-step1.png' });

if (!url.includes('tokens/new')) {
  console.log('GitHubにログインされていません。');
  await browser.close();
  process.exit(3);
}

console.log('ログイン済み！トークン作成中...');

// Note
await page.fill('#token_description', 'tabi-deploy').catch(() => {});

// repo スコープをチェック
const repoCheck = page.locator('input[value="repo"]').first();
if (!await repoCheck.isChecked()) await repoCheck.check();
console.log('repoスコープ選択完了');

await page.screenshot({ path: 'pat-before-submit.png' });

// Generate token
await page.click('button:has-text("Generate token")');
await page.waitForTimeout(3000);

await page.screenshot({ path: 'pat-result.png' });

// トークンを取得
const bodyText = await page.textContent('body');
const match = bodyText?.match(/ghp_[A-Za-z0-9]{36,}/);
if (match) {
  const token = match[0];
  console.log('SUCCESS - TOKEN取得完了');
  writeFileSync('C:\\Users\\aya18\\AppData\\Local\\Temp\\gh_token.txt', token);
  console.log('トークンを保存しました');
} else {
  console.log('トークンが見つかりません - スクリーンショット確認してください');
}

await browser.close();
