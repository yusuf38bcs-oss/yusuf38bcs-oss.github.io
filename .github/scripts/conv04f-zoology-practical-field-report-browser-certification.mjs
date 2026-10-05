import { chromium } from 'playwright';

const base = process.env.LBFL_PREVIEW_URL || 'http://127.0.0.1:4000';
const route = '/biology/higher-zoology-tree/practical/field-report/';
const url = new URL(route, base).toString();
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const page = await browser.newPage({ viewport });
    await page.goto(url, { waitUntil: 'networkidle' });
    if ((await page.locator('h1').count()) !== 1) throw new Error('Field Report H1 count != 1');
    if ((await page.locator('.lbfl-academic-table-wrap.zoology-practical-table-scroll').count()) !== 2) throw new Error('accessible table wrapper count != 2');
    if ((await page.locator('a[href="/learn/"]').count()) < 1) throw new Error('canonical Learning Guide link missing');
    const text = await page.locator('main').innerText();
    for (const required of ['17-mark Field-report Distribution from Syllabus','Shannon–Wiener','Socratic Review']) {
      if (!text.includes(required)) throw new Error(`missing protected text: ${required}`);
    }
    await page.keyboard.press('Tab');
    await page.close();
  }
  console.log('CONV-04F-09-R101 Field Report browser PASS');
} finally {
  await browser.close();
}
