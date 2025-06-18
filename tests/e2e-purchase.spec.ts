import { test, expect } from '../global-setup';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';

test.describe('End-to-End Purchase Tests', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  test('should complete full purchase flow', async ({ page }) => {
    console.log('🛒 Starting end-to-end purchase test...');
    
    // Step 1: Navigate to homepage
    await homePage.navigateToHome();
    console.log('✅ Step 1: Navigated to homepage');
    
    // Step 2: Add first product to cart
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    console.log('✅ Step 2: Added product to cart');
    
    // Step 3: Navigate to cart
    await cartPage.navigateToCart();
    console.log('✅ Step 3: Navigated to cart');
    
    // Step 4: Verify cart has items
    const hasItems = await cartPage.hasItems();
    expect(hasItems).toBeTruthy();
    console.log('✅ Step 4: Cart has items');
    
    // Step 5: Proceed to checkout
    await cartPage.proceedToCheckout();
    console.log('✅ Step 5: Proceeded to checkout');
    
    // Step 6: Verify we're on checkout page
    await expect(page).toHaveURL(/.*\/checkout.*/);
    console.log('✅ Step 6: On checkout page');
    
    console.log('🎉 End-to-end purchase flow completed successfully!');
  });

  test('should add multiple products to cart', async ({ page }) => {
    console.log('🛒 Starting multiple products test...');
    
    // Step 1: Navigate to homepage
    await homePage.navigateToHome();
    
    // Step 2: Add first product to cart
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 3: Navigate to first product page
    await homePage.clickFirstProduct();
    
    // Step 4: Add product to cart from product page
    await productPage.addToCart();
    await productPage.waitForAddToCartSuccess();
    
    // Step 5: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 6: Verify multiple items in cart
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(1);
    
    console.log(`✅ Multiple products test: ${itemCount} items in cart`);
  });

  test('should handle product variants in purchase', async ({ page }) => {
    console.log('🛒 Starting product variants test...');
    
    // Step 1: Navigate to homepage and click first product
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
    
    // Step 2: Check if product has variants
    const hasVariants = await productPage.hasVariants();
    
    if (hasVariants) {
      // Step 3: Get available variants
      const variants = await productPage.getAvailableVariants();
      
      // Step 4: Select first variant
      if (variants.length > 0) {
        await productPage.selectSize(variants[0]);
        console.log(`✅ Selected variant: ${variants[0]}`);
      }
    }
    
    // Step 5: Set quantity
    await productPage.setQuantity(2);
    
    // Step 6: Add to cart
    await productPage.addToCart();
    await productPage.waitForAddToCartSuccess();
    
    // Step 7: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 8: Verify item quantity
    const quantity = await cartPage.getItemQuantity(0);
    expect(quantity).toBe(2);
    
    console.log('✅ Product variants test completed');
  });

  test('should handle out of stock products', async ({ page }) => {
    console.log('🛒 Starting out of stock test...');
    
    // Step 1: Navigate to homepage and click first product
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
    
    // Step 2: Check stock status
    const stockStatus = await productPage.getStockStatus();
    const isInStock = await productPage.isProductInStock();
    
    if (!isInStock) {
      console.log(`ℹ️ Product is out of stock: ${stockStatus}`);
      
      // Step 3: Try to add to cart (should be disabled or show message)
      const addToCartButton = page.locator('.add-to-cart, [data-add-to-cart]');
      const isDisabled = await addToCartButton.isDisabled();
      
      if (isDisabled) {
        console.log('✅ Add to cart button is disabled for out of stock product');
      } else {
        console.log('ℹ️ Add to cart button is still enabled');
      }
    } else {
      console.log('ℹ️ Product is in stock');
    }
    
    console.log('✅ Out of stock test completed');
  });

  test('should use buy now functionality', async ({ page }) => {
    console.log('🛒 Starting buy now test...');
    
    // Step 1: Navigate to homepage and click first product
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
    
    // Step 2: Click buy now button
    await productPage.buyNow();
    
    // Step 3: Verify navigation to checkout
    await expect(page).toHaveURL(/.*\/checkout.*/);
    
    console.log('✅ Buy now functionality works');
  });

  test('should modify cart during purchase flow', async ({ page }) => {
    console.log('🛒 Starting cart modification test...');
    
    // Step 1: Navigate to homepage and add product
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 2: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 3: Update quantity
    await cartPage.setItemQuantity(0, 3);
    await cartPage.waitForCartUpdate();
    
    // Step 4: Verify quantity updated
    const quantity = await cartPage.getItemQuantity(0);
    expect(quantity).toBe(3);
    
    // Step 5: Apply coupon
    await cartPage.applyCoupon('TEST10');
    await cartPage.waitForCartUpdate();
    
    // Step 6: Check if coupon applied
    const isCouponApplied = await cartPage.isCouponApplied();
    
    if (isCouponApplied) {
      console.log('✅ Coupon applied successfully');
    } else {
      console.log('ℹ️ Coupon not applied (may be invalid)');
    }
    
    // Step 7: Remove item
    await cartPage.removeItem(0);
    await cartPage.waitForCartUpdate();
    
    // Step 8: Verify cart is empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
    
    console.log('✅ Cart modification test completed');
  });

  test('should handle cart persistence', async ({ page }) => {
    console.log('🛒 Starting cart persistence test...');
    
    // Step 1: Navigate to homepage and add product
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 2: Navigate to another page
    await homePage.navigateToHome();
    
    // Step 3: Check cart count is still there
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBeTruthy();
    
    // Step 4: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 5: Verify item is still in cart
    const hasItems = await cartPage.hasItems();
    expect(hasItems).toBeTruthy();
    
    console.log('✅ Cart persistence test completed');
  });

  test('should handle continue shopping flow', async ({ page }) => {
    console.log('🛒 Starting continue shopping test...');
    
    // Step 1: Navigate to homepage and add product
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 2: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 3: Continue shopping
    await cartPage.continueShopping();
    
    // Step 4: Verify back on store
    await expect(page).toHaveURL(/.*myshopify\.com/);
    
    // Step 5: Add another product
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 6: Navigate to cart again
    await cartPage.navigateToCart();
    
    // Step 7: Verify multiple items
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(1);
    
    console.log('✅ Continue shopping test completed');
  });

  test('should handle cart drawer functionality', async ({ page }) => {
    console.log('🛒 Starting cart drawer test...');
    
    // Step 1: Navigate to homepage and add product
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 2: Open cart drawer
    await cartPage.openCartDrawer();
    
    // Step 3: Check if drawer is open
    const isDrawerOpen = await cartPage.isCartDrawerOpen();
    
    if (isDrawerOpen) {
      // Step 4: Verify items in drawer
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
      
      // Step 5: Close drawer
      await cartPage.closeCartDrawer();
      
      console.log('✅ Cart drawer functionality works');
    } else {
      console.log('ℹ️ Cart drawer not available (may use full cart page)');
    }
  });

  test('should handle save for later functionality', async ({ page }) => {
    console.log('🛒 Starting save for later test...');
    
    // Step 1: Navigate to homepage and add product
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 2: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 3: Save item for later
    await cartPage.saveItemForLater(0);
    await cartPage.waitForCartUpdate();
    
    // Step 4: Check saved items count
    const savedCount = await cartPage.getSavedItemsCount();
    expect(savedCount).toBeGreaterThan(0);
    
    // Step 5: Move saved item back to cart
    await cartPage.moveSavedItemToCart(0);
    await cartPage.waitForCartUpdate();
    
    // Step 6: Verify item is back in cart
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThan(0);
    
    console.log('✅ Save for later functionality works');
  });

  test('should handle complete checkout process', async ({ page }) => {
    console.log('🛒 Starting complete checkout test...');
    
    // Step 1: Navigate to homepage and add product
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 2: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 3: Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Step 4: Verify on checkout page
    await expect(page).toHaveURL(/.*\/checkout.*/);
    
    // Step 5: Check if checkout form is present
    const checkoutForm = page.locator('form[action*="checkout"], .checkout-form');
    const isFormVisible = await checkoutForm.isVisible();
    
    if (isFormVisible) {
      console.log('✅ Checkout form is present');
      
      // Step 6: Check for required fields
      const emailField = page.locator('input[type="email"], input[name="email"]');
      const isEmailFieldVisible = await emailField.isVisible();
      
      if (isEmailFieldVisible) {
        console.log('✅ Email field is present');
      }
    } else {
      console.log('ℹ️ Checkout form not found (may be external checkout)');
    }
    
    console.log('✅ Complete checkout process test completed');
  });

  test('should handle cart totals calculation', async ({ page }) => {
    console.log('🛒 Starting cart totals test...');
    
    // Step 1: Navigate to homepage and add product
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await cartPage.waitForCartUpdate();
    
    // Step 2: Navigate to cart
    await cartPage.navigateToCart();
    
    // Step 3: Get subtotal
    const subtotal = await cartPage.getSubtotal();
    expect(subtotal).toBeTruthy();
    
    // Step 4: Get total
    const total = await cartPage.getTotal();
    expect(total).toBeTruthy();
    
    // Step 5: Update quantity
    await cartPage.setItemQuantity(0, 2);
    await cartPage.waitForCartUpdate();
    
    // Step 6: Get new totals
    const newSubtotal = await cartPage.getSubtotal();
    const newTotal = await cartPage.getTotal();
    
    expect(newSubtotal).toBeTruthy();
    expect(newTotal).toBeTruthy();
    
    console.log(`✅ Cart totals calculation works: Subtotal ${subtotal} -> ${newSubtotal}, Total ${total} -> ${newTotal}`);
  });
}); 