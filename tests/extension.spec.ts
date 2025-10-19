import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const dist = path.resolve(__dirname, '..', 'dist');

test.describe('Chrome Extension E2E Tests', () => {
  test('extension loads and popup works', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
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

    // Check if content script is working by looking for the extension indicator
    const indicator = page.locator('#extension-indicator');
    await expect(indicator).toBeVisible({ timeout: 10000 });
    await expect(indicator).toHaveText('Extension Active');

    await context.close();
  });

  test('content script highlights links', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${dist}`,
        `--load-extension=${dist}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const [page] = context.pages();
    
    // Navigate to a page with links
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');

    // Send message to content script to highlight links
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'highlightLinks' }, (response) => {
          resolve(response);
        });
      });
    });

    expect(result).toBeDefined();

    // Check if links have outline style
    const links = page.locator('a');
    const firstLink = links.first();
    if (await firstLink.count() > 0) {
      const outlineStyle = await firstLink.evaluate(el => getComputedStyle(el).outlineStyle);
      expect(outlineStyle).toBe('solid');
    }

    await context.close();
  });

  test('extension storage works', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
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

    // Test storage functionality
    const storageResult = await page.evaluate(() => {
      return new Promise((resolve) => {
        chrome.storage.local.set({ 'testKey': 'testValue' }, () => {
          chrome.storage.local.get(['testKey'], (result) => {
            resolve(result);
          });
        });
      });
    });

    expect(storageResult).toEqual({ testKey: 'testValue' });

    await context.close();
  });

  test('background script is active', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
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

    // Test background script communication
    const tabInfo = await page.evaluate(() => {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getTabInfo' }, (response) => {
          resolve(response);
        });
      });
    });

    expect(tabInfo).toBeDefined();
    expect(tabInfo.url).toContain('example.com');

    await context.close();
  });
});
