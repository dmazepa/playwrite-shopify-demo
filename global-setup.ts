import { test as base } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Extend the test with global setup
export const test = base.extend({
  // Global setup for each test
  page: async ({ page }, use) => {
    // Handle store password protection
    await page.goto('/');
    
    // Check if password form is visible
    const passwordForm = page.locator('#Password');
    const passwordLink = page.locator('.password-link');
    const isPasswordFormVisible = await passwordLink.isVisible();
    
    if (isPasswordFormVisible) {
      console.log('🔐 Store is password protected, entering password...');
      
      // Get password from environment variable
      const password = process.env.SHOPIFY_STORE_PASSWORD;
      if (!password) {
        throw new Error('SHOPIFY_STORE_PASSWORD environment variable is not set. Please add it to your .env file.');
      }

      // Click enter or submit button
      await passwordLink.click();

      // Enter password
      await passwordForm.fill(password);
      const enterButton = page.locator('.password-button');
      await enterButton.click();
      
      // Wait for navigation to store
      try {
        await page.waitForURL('**/myshopify.com/**', { timeout: 10000 });
        console.log('✅ Successfully authenticated');
      } catch (error) {
        console.log('⚠️ Authentication may have failed, continuing with test...');
      }
    } else {
      console.log('✅ Store is not password protected');
    }
    
    await use(page);
  },
});

export { expect } from '@playwright/test'; 