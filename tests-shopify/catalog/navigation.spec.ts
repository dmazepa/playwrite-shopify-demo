import { test, expect } from '../../global-setup';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('https://01pxnh-tj.myshopify.com/');
  });

  test('main navigation', async ({ page }) => {
    // Assertions use the expect API.
    await expect(page).toHaveURL('https://01pxnh-tj.myshopify.com/password');
  });
});