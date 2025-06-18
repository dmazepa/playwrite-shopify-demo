import { test, expect } from '../global-setup';

test.describe('Authentication Tests', () => {
  test('should be authenticated and access store', async ({ page }) => {
    // Navigate to the store homepage
    await page.goto('/');
    
    // Verify we're on the store homepage (not password page)
    await expect(page).toHaveURL(/.*myshopify\.com/);
    
    // Check that we can see store content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Enter using password');
    expect(bodyText).not.toContain('Password');
    
    // Verify we can access the store
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Authentication test passed - store is accessible');
  });

  test('should access collections page', async ({ page }) => {
    // Navigate to collections
    await page.goto('/collections');
    
    // Verify we're on collections page
    await expect(page).toHaveURL(/.*\/collections/);
    
    // Check that we can see collections content
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Collections access test passed');
  });

  test('should access products page', async ({ page }) => {
    // Navigate to products
    await page.goto('/products');
    
    // Verify we're on products page
    await expect(page).toHaveURL(/.*\/products/);
    
    // Check that we can see products content
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Products access test passed');
  });
}); 