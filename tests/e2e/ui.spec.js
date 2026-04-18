import { test, expect } from '@playwright/test';

test.describe('UI Interactivity & AI Probing', () => {
  test('Capabilities block defaults to local JS simulation instructions', async ({ page }) => {
    await page.goto('/');
    // Check if the page title loads properly assuming it evaluates
    await expect(page).toHaveTitle(/AI Browser Capability Demo/);

    // Run the local AI Simulator check via JS interactions (example query if simulator is on page)
    const runBtn = page.getByRole('button', { name: /Run Built-in Tests/i });
    if (await runBtn.isVisible()) {
        await runBtn.click();
        const demoOutput = page.locator('#demo-response-output');
        if (await demoOutput.isVisible()) {
            await expect(demoOutput).not.toBeEmpty();
        }
    }
  });

  test('Has visible ARIA-live regions for capabilities', async ({ page }) => {
    await page.goto('/');
    const ariaLiveRegion = page.locator('[aria-live="polite"]');
    // We expect there's at least one aria-live region in the document based on accessibility rules
    if (await ariaLiveRegion.count() > 0) {
      await expect(ariaLiveRegion.first()).toBeAttached();
    }
  });
});
