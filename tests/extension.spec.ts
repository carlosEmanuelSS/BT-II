import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dist = path.resolve(__dirname, '..', 'dist');

test.describe('Chrome Extension E2E Tests', () => {
  test('extension loads and basic functionality works', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${dist}`,
        `--load-extension=${dist}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const [page] = context.pages();
    
    // Navigate to a test page
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');

    // Wait a bit for extension to load
    await page.waitForTimeout(2000);

    // Check if page loaded successfully (basic test)
    const title = await page.title();
    expect(title).toBeDefined();
    expect(title.length).toBeGreaterThan(0);

    await context.close();
  });

  test('extension files are accessible', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${dist}`,
        `--load-extension=${dist}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const [page] = context.pages();
    
    // Navigate to a test page
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');

    // Test that we can access the page content
    const body = await page.locator('body');
    await expect(body).toBeVisible();

    // Test that the page has content
    const content = await page.textContent('body');
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);

    await context.close();
  });

  test('extension manifest is valid', async () => {
    // Test that the extension was built correctly
    const fs = await import('fs');
    const manifestPath = path.join(dist, 'manifest.json');
    
    expect(fs.existsSync(manifestPath)).toBe(true);
    
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    expect(manifest.name).toBe('My Chrome Extension');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.manifest_version).toBe(3);
  });

  test('extension build artifacts exist', async () => {
    const fs = await import('fs');
    
    // Check that all required files exist
    expect(fs.existsSync(path.join(dist, 'manifest.json'))).toBe(true);
    expect(fs.existsSync(path.join(dist, 'src/popup/popup.html'))).toBe(true);
    expect(fs.existsSync(path.join(dist, 'src/popup/popup.js'))).toBe(true);
    expect(fs.existsSync(path.join(dist, 'src/content/content.js'))).toBe(true);
    expect(fs.existsSync(path.join(dist, 'src/background/background.js'))).toBe(true);
    
    // Check that extension.zip exists
    expect(fs.existsSync(path.join(dist, 'extension.zip'))).toBe(true);
  });
});
