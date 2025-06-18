import { test, expect } from '../../global-setup';
import { env } from '../config/env';

test.describe('place order', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('https://01pxnh-tj.myshopify.com/');
  });

  test('place order as guest', async ({ page }) => {
    // "page" belongs to an isolated BrowserContext, created for this specific test.
    await page.goto('https://01pxnh-tj.myshopify.com/');
    // Create a locator.
    const enterUsingPassword = page.getByText('Enter using password');
    // Click it.
    await enterUsingPassword.click();

    await page.goto('https://01pxnh-tj.myshopify.com/');
    //Create and click on locator
    await page.getByText('Enter using password').click();

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle("My Store");
  });

  test('place order as registered user', async ({ page }) => {
    // "page" in this second test is completely isolated from the first test.

    await page.goto('https://01pxnh-tj.myshopify.com/');

  });

  test('place order recorder by codegen', async ({ page }) => {
    await page.goto('https://01pxnh-tj.myshopify.com/password');
    await page.getByRole('button', { name: 'Enter using password' }).click();
    await page.getByRole('textbox', { name: 'Your password' }).click();
    await page.getByRole('textbox', { name: 'Your password' }).fill(env.PASSWORD as string);
    await page.getByRole('button', { name: 'Enter', exact: true }).click();
    await page.getByRole('button', { name: 'Accept' }).click();
    await page.getByRole('link', { name: 'Chequered Red Shirt' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'View cart (1)' }).click();
    await page.getByRole('button', { name: 'Check out' }).click();
    await page.getByRole('textbox', { name: 'Email or mobile phone number' }).fill('dmazepa@yopmail.com');
    await page.getByRole('textbox', { name: 'First name (optional)' }).click();
    await page.getByRole('textbox', { name: 'First name (optional)' }).fill('Dima');
    await page.getByRole('textbox', { name: 'First name (optional)' }).press('Tab');
    await page.getByRole('textbox', { name: 'Last name' }).fill('Mazepa');
    await page.getByRole('textbox', { name: 'Last name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Address' }).fill('dfre');
    await page.getByRole('textbox', { name: 'Postal code' }).click();
    await page.getByRole('textbox', { name: 'Postal code' }).fill('80001');
    await page.getByRole('textbox', { name: 'City' }).click();
    await page.getByRole('textbox', { name: 'City' }).fill('Presov');
    await expect(page.getByText('ContactLog in')).toBeVisible();
    await expect(page.locator('#payment')).toContainText('Payment');
    await expect(page.getByLabel('Navigate to Online Store')).toMatchAriaSnapshot(`
    - link "Navigate to Online Store":
      - /url: https://01pxnh-tj.myshopify.com
    `);
    const page1Promise = page.waitForEvent('popup');
    await page.locator('iframe[name="PAY_WITH_PAYPAL-iframe"]').contentFrame().getByRole('button', { name: 'Pay with PayPal' }).click();
    const page1 = await page1Promise;
    await page1.getByRole('textbox', { name: 'Email or mobile number' }).click();
    await page1.getByRole('textbox', { name: 'Email or mobile number' }).fill('fake@email.com');
    await page1.getByRole('button', { name: 'Next' }).click();
    await page1.getByRole('textbox', { name: 'Password' }).click();
    await page1.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page1.getByRole('button', { name: 'Log In' }).click();    
  });
});
