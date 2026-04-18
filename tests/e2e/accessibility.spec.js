import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Analysis', () => {
  const pages = [
    '/',
    '/browser-ai-configuration.html',
    '/experiment-recipes.html'
  ];

  for (const pageUrl of pages) {
    test(`Should not have any automatically detectable accessibility issues on ${pageUrl}`, async ({ page }) => {
      await page.goto(pageUrl);
      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test(`Should not have any accessibility issues in dark mode on ${pageUrl}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(pageUrl);
      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
