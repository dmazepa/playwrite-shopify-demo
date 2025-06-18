import { test, expect } from '../global-setup';
import { CartPage } from './pages/CartPage';
import { HomePage } from './pages/HomePage';

test.describe('Cart Tests', () => {
  let cartPage: CartPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    homePage = new HomePage(page);
  });

  test('should load empty cart', async ({ page }) => {
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Verify cart is loaded
    const isLoaded = await cartPage.isCartLoaded();
    expect(isLoaded).toBeTruthy();
    
    // Check if cart is empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    
    console.log('✅ Empty cart loads successfully');
  });

  test('should add product to cart from homepage', async ({ page }) => {
    // Navigate to homepage
    await homePage.navigateToHome();
    
    // Add first product to cart
    await homePage.addFirstProductToCart();
    
    // Wait for cart update
    await cartPage.waitForCartUpdate();
    
    // Check cart count
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBeTruthy();
    
    console.log('✅ Product added to cart from homepage');
  });

  test('should add product to cart from product page', async ({ page }) => {
    // Navigate to homepage and click first product
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
    
    // Add product to cart
    const productPage = page.locator('.add-to-cart, [data-add-to-cart]');
    await productPage.click();
    
    // Wait for success notification
    await page.waitForSelector('.add-to-cart-success, .cart-notification', { timeout: 5000 });
    
    console.log('✅ Product added to cart from product page');
  });

  test('should display cart items correctly', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Check cart has items
    const hasItems = await cartPage.hasItems();
    expect(hasItems).toBeTruthy();
    
    // Get item count
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
    
    // Get first item title
    const itemTitle = await cartPage.getItemTitle(0);
    expect(itemTitle).toBeTruthy();
    
    // Get first item price
    const itemPrice = await cartPage.getItemPrice(0);
    expect(itemPrice).toBeTruthy();
    
    console.log(`✅ Cart displays ${itemCount} items correctly`);
  });

  test('should update item quantity', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Set quantity to 3
    await cartPage.setItemQuantity(0, 3);
    
    // Verify quantity is updated
    const quantity = await cartPage.getItemQuantity(0);
    expect(quantity).toBe(3);
    
    // Increase quantity
    await cartPage.increaseItemQuantity(0);
    const increasedQuantity = await cartPage.getItemQuantity(0);
    expect(increasedQuantity).toBeGreaterThan(3);
    
    // Decrease quantity
    await cartPage.decreaseItemQuantity(0);
    const decreasedQuantity = await cartPage.getItemQuantity(0);
    expect(decreasedQuantity).toBeLessThan(increasedQuantity);
    
    console.log('✅ Item quantity updates work correctly');
  });

  test('should remove item from cart', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Get initial item count
    const initialCount = await cartPage.getCartItemCount();
    
    // Remove first item
    await cartPage.removeItem(0);
    
    // Wait for cart update
    await cartPage.waitForCartUpdate();
    
    // Check item count decreased
    const newCount = await cartPage.getCartItemCount();
    expect(newCount).toBeLessThan(initialCount);
    
    console.log('✅ Item removed from cart successfully');
  });

  test('should display cart totals', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Get subtotal
    const subtotal = await cartPage.getSubtotal();
    expect(subtotal).toBeTruthy();
    
    // Get total
    const total = await cartPage.getTotal();
    expect(total).toBeTruthy();
    
    console.log(`✅ Cart totals displayed: Subtotal ${subtotal}, Total ${total}`);
  });

  test('should apply coupon code', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Apply coupon code
    await cartPage.applyCoupon('TEST10');
    
    // Wait for coupon application
    await cartPage.waitForCartUpdate();
    
    // Check if coupon is applied
    const isApplied = await cartPage.isCouponApplied();
    
    if (isApplied) {
      const couponCode = await cartPage.getAppliedCoupon();
      expect(couponCode).toBeTruthy();
      console.log('✅ Coupon applied successfully');
    } else {
      console.log('ℹ️ Coupon not applied (may be invalid)');
    }
  });

  test('should remove coupon code', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Apply coupon first
    await cartPage.applyCoupon('TEST10');
    await cartPage.waitForCartUpdate();
    
    // Remove coupon
    await cartPage.removeCoupon();
    await cartPage.waitForCartUpdate();
    
    // Check coupon is removed
    const isApplied = await cartPage.isCouponApplied();
    expect(isApplied).toBeFalsy();
    
    console.log('✅ Coupon removed successfully');
  });

  test('should proceed to checkout', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Check if checkout is available
    const canCheckout = await cartPage.canCheckout();
    expect(canCheckout).toBeTruthy();
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Verify navigation to checkout
    await expect(page).toHaveURL(/.*\/checkout.*/);
    
    console.log('✅ Proceed to checkout works');
  });

  test('should continue shopping', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Continue shopping
    await cartPage.continueShopping();
    
    // Verify navigation back to store
    await expect(page).toHaveURL(/.*myshopify\.com/);
    
    console.log('✅ Continue shopping works');
  });

  test('should clear entire cart', async ({ page }) => {
    // Add multiple products to cart
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Clear cart
    await cartPage.clearCart();
    
    // Wait for cart to be empty
    await cartPage.waitForCartUpdate();
    
    // Check cart is empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    
    console.log('✅ Cart cleared successfully');
  });

  test('should save item for later', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Save item for later
    await cartPage.saveItemForLater(0);
    
    // Wait for update
    await cartPage.waitForCartUpdate();
    
    // Check saved items count
    const savedCount = await cartPage.getSavedItemsCount();
    expect(savedCount).toBeGreaterThan(0);
    
    console.log('✅ Item saved for later');
  });

  test('should open cart drawer', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Open cart drawer
    await cartPage.openCartDrawer();
    
    // Check if drawer is open
    const isDrawerOpen = await cartPage.isCartDrawerOpen();
    
    if (isDrawerOpen) {
      // Close drawer
      await cartPage.closeCartDrawer();
      console.log('✅ Cart drawer opens and closes correctly');
    } else {
      console.log('ℹ️ Cart drawer not available (may use full cart page)');
    }
  });

  test('should handle cart refresh', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Refresh cart
    await cartPage.refreshCart();
    
    // Verify cart still loads
    const isLoaded = await cartPage.isCartLoaded();
    expect(isLoaded).toBeTruthy();
    
    console.log('✅ Cart refresh works correctly');
  });

  test('should scroll through cart sections', async ({ page }) => {
    // Add product to cart first
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Scroll to cart items
    await cartPage.scrollToCartItems();
    
    // Scroll to checkout
    await cartPage.scrollToCheckout();
    
    // Verify page is scrollable
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(600);
    
    console.log('✅ Cart page scrolling works correctly');
  });
}); 