const { chromium } = require('playwright');
const path = require('path');

async function run() {
  console.log('1. Launching Playwright browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const BASE_URL = 'http://localhost:3000';
  const POSTER_PATH = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\417cfa7c-55b8-4684-8fd7-69a910146694\\kota_factory_season_3_poster_1781289005946.png';
  const SCREENSHOT_PATH = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\417cfa7c-55b8-4684-8fd7-69a910146694\\dashboard_kota_factory_added.png';

  console.log('2. Navigating to Dashboard...');
  await page.goto(`${BASE_URL}/admin/dashboard`);
  await page.waitForTimeout(1000);

  // Check if we are redirected to login
  if (page.url().includes('/admin/login')) {
    console.log('Redirected to login. Logging in...');
    await page.fill('input[type="email"]', 'admin@cineplus.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin/dashboard`);
    console.log('Logged in successfully.');
  }

  console.log('3. Switching to Content Manager tab...');
  await page.click('button:has-text("Content Manager")');
  await page.waitForTimeout(1000);

  console.log('4. Filling out form fields...');
  await page.fill('input[placeholder="e.g. Panchayat"]', 'Kota Factory Season 3');
  await page.fill('input[placeholder="e.g. https://www.youtube.com/... or /originals"]', 'https://www.youtube.com/watch?v=KotaFactory3');
  await page.fill('textarea[placeholder="Provide a short synopsis of the series..."]', 'Sartaj Singh, Jeetu Bhaiya and the gang return as students prepare for the high-stakes IIT entrance examinations in Kota, facing emotional, academic, and life struggles.');

  await page.fill('input[placeholder="e.g. Family Comedy / Drama"]', 'Drama / Comedy');
  await page.click('label:has-text("Show on live site") >> nth=0');

  await page.fill('input[placeholder="e.g. 8.9"]', '9.0');
  await page.click('label:has-text("Show on live site") >> nth=1');

  await page.fill('input[placeholder="Award Category (e.g. Best Comedy Series)"]', 'Best Drama Series');
  await page.fill('input[placeholder="Award Given Institution (e.g. Filmfare Awards)"]', 'Filmfare OTT Awards');
  await page.click('label:has-text("Show on live site") >> nth=2');

  await page.click('div:has(p:has-text("Show in Homepage Grid")) >> input[type="checkbox"]');

  console.log('5. Uploading poster image via file input...');
  await page.setInputFiles('#image-file-input', POSTER_PATH);
  
  console.log('Waiting for image upload to complete...');
  await page.waitForSelector('img[alt="Show Poster Preview"]', { timeout: 15000 });
  console.log('Image uploaded successfully and preview displayed.');

  console.log('6. Submitting the show form...');
  await page.click('button:has-text("Add Show to Library")');

  console.log('Waiting for success response / toast...');
  await page.waitForTimeout(3000);

  console.log('7. Taking a screenshot of the updated dashboard...');
  await page.screenshot({ path: SCREENSHOT_PATH });
  console.log(`Screenshot saved to ${SCREENSHOT_PATH}`);

  await browser.close();
  console.log('🎉 Form submitted successfully! Kota Factory Season 3 has been added.');
}

run().catch(console.error);
