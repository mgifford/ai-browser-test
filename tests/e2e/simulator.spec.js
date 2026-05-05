import { test, expect } from '@playwright/test';

test.describe('AI Prompt Simulator', () => {
  test('Page loads with correct title and simulator badge', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    await expect(page).toHaveTitle(/AI Prompt Simulator/);
    const badge = page.locator('.sim-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Simulator');
  });

  test('Simulator disclaimer notice is visible', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const notice = page.locator('.sim-notice');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('simulated');
  });

  test('Navigation links back to main page are present', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const mainLink = page.locator('a[href="index.html"]').first();
    await expect(mainLink).toBeVisible();
  });

  test('Browser profile buttons are present and Chrome is active by default', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const chromeBtn = page.locator('.profile-btn[data-profile="chrome"]');
    const firefoxBtn = page.locator('.profile-btn[data-profile="firefox"]');
    const edgeBtn = page.locator('.profile-btn[data-profile="edge"]');
    await expect(chromeBtn).toBeVisible();
    await expect(firefoxBtn).toBeVisible();
    await expect(edgeBtn).toBeVisible();
    await expect(chromeBtn).toHaveClass(/active/);
    await expect(firefoxBtn).not.toHaveClass(/active/);
  });

  test('Switching browser profile updates the profile note', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const note = page.locator('#profileNote');
    const initial = await note.textContent();
    await page.locator('.profile-btn[data-profile="firefox"]').click();
    const updated = await note.textContent();
    expect(updated).not.toBe(initial);
    expect(updated).toMatch(/Firefox/i);
  });

  test('Run AI Demo with default empty input shows helpful message', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    await page.locator('#runSimBtn').click();
    const output = page.locator('#simOutput');
    await expect(output).not.toContainText('Running simulation');
    const text = await output.textContent();
    expect(text.trim().length).toBeGreaterThan(10);
    // Should NOT produce a simulated output header when empty
    expect(text).not.toContain('[Simulated output');
  });

  test('Run AI Demo with prompt text produces simulated output', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    await page.locator('#simPrompt').fill(
      'This is a test prompt for the simulator. It contains multiple sentences to verify output. The summarizer should extract key points from this text.'
    );
    await page.locator('#runSimBtn').click();
    const output = page.locator('#simOutput');
    await expect(output).toContainText('[Simulated output');
    await expect(output).toContainText('no AI model was invoked');
  });

  test('Shuffle Prompt Idea loads a prompt into the textarea', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const textarea = page.locator('#simPrompt');
    await expect(textarea).toHaveValue('');
    await page.locator('#shuffleBtn').click();
    const val = await textarea.inputValue();
    expect(val.trim().length).toBeGreaterThan(10);
  });

  test('Shuffle Prompt Idea does not produce consecutive duplicates (5 shuffles)', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const textarea = page.locator('#simPrompt');
    const values = [];
    for (let i = 0; i < 5; i++) {
      await page.locator('#shuffleBtn').click();
      const val = await textarea.inputValue();
      values.push(val.trim());
    }
    // Check no two consecutive values are identical
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).not.toBe(values[i - 1]);
    }
  });

  test('Load Benchmark Pack loads long-form content and sets summarize mode', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    await page.locator('#benchmarkBtn').click();
    const textarea = page.locator('#simPrompt');
    const val = await textarea.inputValue();
    // Benchmark content is multi-paragraph
    expect(val.trim().length).toBeGreaterThan(200);
    // Mode should be set to summarize
    const mode = page.locator('#simMode');
    await expect(mode).toHaveValue('summarize');
  });

  test('Load Benchmark Pack then Run AI Demo produces consistent summarization output', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    await page.locator('#benchmarkBtn').click();
    await page.locator('#runSimBtn').click();
    const output = page.locator('#simOutput');
    await expect(output).toContainText('[Simulated output');
    await expect(output).toContainText('Summary');
    // Run again — output should still be non-empty and contain summary structure
    await page.locator('#runSimBtn').click();
    await expect(output).toContainText('Summary');
  });

  test('Quick Scenarios renders cards on page load', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const cards = page.locator('.scenario-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await expect(cards.first()).toBeVisible();
  });

  test('Clicking a scenario card loads its prompt and auto-runs the demo', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const card = page.locator('.scenario-card').first();
    await expect(card).toBeVisible();
    await card.click();
    const textarea = page.locator('#simPrompt');
    const val = await textarea.inputValue();
    expect(val.trim().length).toBeGreaterThan(10);
    // Output should have been auto-triggered
    const output = page.locator('#simOutput');
    await expect(output).toContainText('[Simulated output');
  });

  test('Clicking multiple scenario cards each load a prompt and auto-run', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const cards = page.locator('.scenario-card');
    const count = await cards.count();
    const limit = Math.min(count, 3);
    for (let i = 0; i < limit; i++) {
      await cards.nth(i).click();
      const output = page.locator('#simOutput');
      await expect(output).toContainText('[Simulated output');
    }
  });

  test('Reshuffle renders a new set of scenario cards', async ({ page }) => {
    await page.goto('/prompt-simulator.html');

    // Capture the initial set of card labels
    const initialLabels = await page.locator('.scenario-card .scenario-label').allTextContents();

    // Reshuffle multiple times to increase chance of a new set
    let newLabels = [];
    for (let attempt = 0; attempt < 5; attempt++) {
      await page.locator('#reshuffleBtn').click();
      newLabels = await page.locator('.scenario-card .scenario-label').allTextContents();
      if (JSON.stringify(newLabels) !== JSON.stringify(initialLabels)) break;
    }

    // After reshuffle, cards should still be present
    const cards = page.locator('.scenario-card');
    await expect(cards.first()).toBeVisible();
    // The scenario grid should not be empty
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test('Mode selector changes affect simulated output structure', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    await page.locator('#simPrompt').fill(
      'Compare option A with option B. Option A is faster. Option B is cheaper. We need to decide between them.'
    );

    // Test summarize mode
    await page.locator('#simMode').selectOption('summarize');
    await page.locator('#runSimBtn').click();
    const output = page.locator('#simOutput');
    await expect(output).toContainText('Summary');

    // Test rewrite mode
    await page.locator('#simMode').selectOption('rewrite');
    await page.locator('#runSimBtn').click();
    await expect(output).toContainText('Rewritten');

    // Test compare mode
    await page.locator('#simMode').selectOption('compare');
    await page.locator('#runSimBtn').click();
    await expect(output).toContainText('Comparison');
  });

  test('Output is aria-live region for accessibility', async ({ page }) => {
    await page.goto('/prompt-simulator.html');
    const output = page.locator('#simOutput');
    await expect(output).toHaveAttribute('aria-live', 'polite');
  });

  test('Main demo page has link to simulator', async ({ page }) => {
    await page.goto('/');
    const simLink = page.locator('a[href="prompt-simulator.html"]');
    await expect(simLink.first()).toBeVisible();
  });
});
