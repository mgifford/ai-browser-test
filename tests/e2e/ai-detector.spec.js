import { test, expect } from '@playwright/test';

// Functional smoke test for the detector runner page. Runs across the
// chromium / firefox / webkit matrix defined in playwright.config.js, which
// makes it a cross-browser regression guard for feature detection: the report
// shape and DOM audits must be produced regardless of which built-in AI APIs
// the browser happens to expose.

test.describe('AI Detector page', () => {
  test('loads the module and exposes window.aiDetector', async ({ page }) => {
    await page.goto('/ai-detector.html');
    const hasApi = await page.evaluate(
      () => typeof window.aiDetector?.detectBrowserAI === 'function'
    );
    expect(hasApi).toBe(true);
  });

  test('produces a fully-shaped report when detection runs', async ({ page }) => {
    await page.goto('/ai-detector.html');
    await page.getByRole('button', { name: 'Run detection' }).click();

    // Status flips to "Done" once the async report resolves.
    await expect(page.locator('#status')).toContainText('Done', { timeout: 15000 });

    const report = await page.evaluate(async () => {
      return window.aiDetector.detectBrowserAI({ document });
    });

    // Report contract (matches AIBrowserReport in src/ai-detector.d.ts).
    expect(typeof report.browser).toBe('string');
    expect(typeof report.secureContext).toBe('boolean');
    expect(report.chromeBuiltInAI).toBeTruthy();
    expect(['readily', 'after-download', 'no', 'unsupported']).toContain(
      report.chromeBuiltInAI.promptApi
    );
    expect(report.contextReadiness.score).toBeGreaterThanOrEqual(0);
    expect(report.contextReadiness.score).toBeLessThanOrEqual(100);
    // The runner page itself has a <main> landmark, so this must be true.
    expect(report.contextReadiness.hasSemanticMain).toBe(true);
    expect(report.privacyControls).toBeTruthy();
    expect(report.writingTools).toBeTruthy();
    expect(report.structuredData).toBeTruthy();
  });

  test('renders the JSON report into the page', async ({ page }) => {
    await page.goto('/ai-detector.html');
    await page.getByRole('button', { name: 'Run detection' }).click();
    await expect(page.locator('#status')).toContainText('Done', { timeout: 15000 });
    const json = await page.locator('#json').textContent();
    expect(json).toContain('"browser"');
    expect(json).toContain('"chromeBuiltInAI"');
  });
});
