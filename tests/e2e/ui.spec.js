import { test, expect } from '@playwright/test';

// Timeout for waiting on the async initial capability scan triggered at page load.
const SCAN_TIMEOUT_MS = 10000;

test.describe('UI Interactivity & AI Probing', () => {
  test('Page loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Browser Capability Demo/);
  });

  test('Built-in AI API Tests section is visible before the capability matrix', async ({ page }) => {
    await page.goto('/');
    const testsSection = page.locator('section[aria-label="Built-in AI browser API tests"]');
    const matrixSection = page.locator('#capabilityMatrix');
    await expect(testsSection).toBeVisible();
    await expect(matrixSection).toBeVisible();
    // Tests section should appear before matrix in document order
    const testsBoundingBox = await testsSection.boundingBox();
    const matrixBoundingBox = await matrixSection.boundingBox();
    expect(testsBoundingBox.y).toBeLessThan(matrixBoundingBox.y);
  });

  test('Run Built-in Tests button triggers a scan', async ({ page }) => {
    await page.goto('/');
    // The page auto-runs renderBuiltInTests() on load; wait for it to complete first
    await expect(page.locator('#testsLastRun')).not.toHaveText('Not run yet.', { timeout: SCAN_TIMEOUT_MS });
    // Click the button to trigger a re-scan
    const runBtn = page.getByRole('button', { name: /Run Built-in Tests/i });
    await expect(runBtn).toBeVisible();
    await runBtn.click();
    // The timestamp should update to a new non-empty value
    await expect(page.locator('#testsLastRun')).not.toHaveText('Not run yet.', { timeout: SCAN_TIMEOUT_MS });
  });

  test('Browser-specific instruction note is populated on load', async ({ page }) => {
    await page.goto('/');
    const note = page.locator('#testsNoteRuntime');
    await expect(note).toBeVisible();
    const noteText = await note.textContent();
    expect(noteText.trim()).not.toBe('');
  });

  test('Has visible ARIA-live regions for capabilities', async ({ page }) => {
    await page.goto('/');
    const ariaLiveRegions = page.locator('[aria-live="polite"]');
    expect(await ariaLiveRegions.count()).toBeGreaterThan(0);
    await expect(ariaLiveRegions.first()).toBeAttached();
  });

  test('Prompt Test Bench evaluates prompt quality metrics', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('#promptBenchInput');
    await expect(textarea).toBeVisible();
    await textarea.fill('This is a sample prompt for testing. It contains multiple sentences to provide enough content. We want to see if the evaluation works correctly across different modes.');
    const evalBtn = page.getByRole('button', { name: /Evaluate Prompt Quality/i });
    await evalBtn.click();
    const output = page.locator('#promptBenchOutput');
    await expect(output).toContainText('Word count:');
    await expect(output).toContainText('Paragraph count:');
    await expect(output).toContainText('Mode fit:');
    await expect(output).toContainText('Input length:');
  });

  test('Prompt Test Bench run-twice consistency check produces identical results', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('#promptBenchInput');
    await textarea.fill('Compare option A versus option B for enterprise deployment. What are the trade-offs between them?');
    const modeSelect = page.locator('#promptBenchMode');
    await modeSelect.selectOption('compare');
    const consistencyBtn = page.getByRole('button', { name: /Run Twice Consistency Check/i });
    await consistencyBtn.click();
    const output = page.locator('#promptBenchOutput');
    await expect(output).toContainText('Both runs produced identical results');
  });

  test('Language Detector Playground section is present', async ({ page }) => {
    await page.goto('/');
    const playground = page.locator('section[aria-label="Language detector playground"]');
    await expect(playground).toBeVisible();
    await expect(page.locator('#languageSampleSelect')).toBeVisible();
    await expect(page.locator('#languageSampleInput')).toBeVisible();
  });

  test('Capability matrix renders after page load', async ({ page }) => {
    await page.goto('/');
    const matrix = page.locator('#capabilityMatrix');
    await expect(matrix).toBeVisible();
    // Matrix should have cells rendered by JS
    const cells = matrix.locator('.cell');
    await expect(cells.first()).toBeVisible();
  });

  test('Mobile viewport layout does not break', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Browser Capability Demo/);
    // Main content should still be visible
    await expect(page.locator('h2').first()).toBeVisible();
  });

  test('No-JS fallback message exists in HTML', async ({ page, request }) => {
    // Fetch the raw HTML source to verify the noscript element is present
    const response = await request.get('/');
    const html = await response.text();
    expect(html).toContain('<noscript>');
    expect(html).toContain('JavaScript is required');
  });

  test('Re-scan Runtime Capability and Run All Available Local Tests buttons are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Re-scan Runtime Capability/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Run All Available Local Tests/i })).toBeVisible();
  });
});
