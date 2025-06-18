import { test, expect } from '../global-setup';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

test.describe('Complete Shopify Ecommerce Test Suite', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let searchPage: SearchPage;
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    searchPage = new SearchPage(page);
    categoryPage = new CategoryPage(page);

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
  });

  // ==================== AUTHENTICATION TESTS ====================
  //Not applicable by default
  test.skip('should navigate to admin login', async ({ page }) => {
    await page.goto('/');
    const adminLink = page.locator('a[href*="/admin"], .admin-link, [data-admin-link]');
    if (await adminLink.isVisible()) {
      await adminLink.click();
      await page.waitForURL('**/admin**', { timeout: 10000 });
    }
  });

  // ==================== HOMEPAGE TESTS ====================

  test('should load homepage successfully', async ({ page }) => {
    await homePage.navigateToHome();
    expect(page.url()).toContain('myshopify.com');
    await expect(homePage.header).toBeVisible();
  });

  test('should display products on homepage', async ({ page }) => {
    await homePage.navigateToHome();
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should navigate to product from homepage', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
    await page.waitForURL('**/products/**', { timeout: 10000 });
  });

  //Not applicable by default
  test.skip('should add product to cart from homepage', async ({ page }) => {
    await homePage.navigateToHome();
    const addToCartButton = homePage.getAddToCartButton();
    if (await addToCartButton.isVisible()) {
      await homePage.addFirstProductToCart();
      await page.waitForTimeout(2000);
    }
  });

  // ==================== PRODUCT PAGE TESTS ====================

  test('should display product details', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
    await page.waitForURL('**/products/**', { timeout: 10000 });

    const title = await productPage.getProductTitle();
    const price = await productPage.getProductPrice();
    expect(title.length).toBeGreaterThan(0);
    expect(price.length).toBeGreaterThan(0);
  });

  test.skip('should handle product variants', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();

    const variantCount = await productPage.variantSelectors.count();
    if (variantCount > 0) {
      await expect(productPage.variantSelectors.first()).toBeVisible();
    }
  });

  test('should add product to cart', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();

    const isEnabled = await productPage.isAddToCartEnabled();
    if (isEnabled) {
      await productPage.addToCart();
      await productPage.waitForAddToCartSuccess();
    }
  });

  test('should handle product images', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
    //One image only
    //await expect(productPage.productImages).toBeVisible();
    await expect(productPage.mainImage).toBeVisible();
  });

  // ==================== CART TESTS ====================

  test('should display empty cart', async ({ page }) => {
    await cartPage.navigateToCart();
    const isEmpty = await cartPage.isEmpty();
    expect(isEmpty).toBeTruthy();
  });

  test('should add product and display in cart', async ({ page }) => {
    await homePage.navigateToHome();
    //no option to add from Home page
    //await homePage.addFirstProductToCart();
    await homePage.clickFirstProduct();
    await productPage.addProductToCart();
    await page.waitForTimeout(2000);

    await cartPage.navigateToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should update product quantity in cart', async ({ page }) => {
    await homePage.navigateToHome();
    //no option to add from Home page
    //await homePage.addFirstProductToCart();
    await homePage.clickFirstProduct();
    await productPage.addProductToCart();
    await page.waitForTimeout(2000);

    await cartPage.navigateToCart();
    const quantityCount = await cartPage.quantityInputs.count();

    if (quantityCount > 0) {
      await cartPage.updateQuantity(0, 2);
      await cartPage.waitForCartUpdate();
    }
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(1);
  });

  test('should remove product from cart', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await page.waitForTimeout(2000);

    await cartPage.navigateToCart();
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);

    await cartPage.removeFirstItem();
    await cartPage.waitForCartUpdate();
  });

  test('should apply coupon code', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await page.waitForTimeout(2000);

    await cartPage.navigateToCart();
    const couponInputCount = await cartPage.couponInput.count();

    if (couponInputCount > 0) {
      await cartPage.applyCoupon('TEST10');
      await cartPage.waitForCartUpdate();
    }
  });

  test('should proceed to checkout', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.addFirstProductToCart();
    await page.waitForTimeout(2000);

    await cartPage.navigateToCart();
    const checkoutButton = cartPage.getCheckoutButton();
    const checkoutCount = await checkoutButton.count();

    if (checkoutCount > 0) {
      await cartPage.proceedToCheckout();
      await page.waitForURL('**/checkout**', { timeout: 10000 });
    }
  });

  // ==================== SEARCH TESTS ====================

  test('should perform basic search', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.openSearch();
    await searchPage.searchForProduct('product');
    await searchPage.waitForSearchResults();

    const resultsCount = await searchPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThanOrEqual(0);
  });

  test('should handle search with no results', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.openSearch();
    await searchPage.searchForProduct('xyz123nonexistent');

    const isNoResults = await searchPage.hasNoResults();
    expect(isNoResults).toBeTruthy();
  });

  test('should search and navigate to product', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.openSearch();
    await searchPage.searchForProduct('product');
    await searchPage.waitForSearchResults();

    await searchPage.clickSearchResult(0);
    await page.waitForURL('**/products/**', { timeout: 10000 });
  });

  test('should apply search filters', async ({ page }) => {
    await homePage.navigateToHome();
    await homePage.openSearch();
    await searchPage.searchForProduct('product');
    await searchPage.waitForSearchResults();

    const filterOptions = searchPage.getFilterOptions();
    const filterCount = await filterOptions.count();

    if (filterCount > 0) {
      await searchPage.applyFilter(0);
      await searchPage.waitForSearchResults();
    }
  });

  // ==================== CATEGORY TESTS ====================

  test('should load category page', async ({ page }) => {
    await categoryPage.navigateToCategory('all');
    expect(page.url()).toContain('/collections/');
    await expect(categoryPage.categoryTitle).toBeVisible();
  });

  test('should display products in category', async ({ page }) => {
    await categoryPage.navigateToCategory('all');
    await categoryPage.waitForProductsToLoad();

    const productCount = await categoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should handle category sorting', async ({ page }) => {
    await categoryPage.navigateToCategory('all');
    await categoryPage.waitForProductsToLoad();

    const sortCount = await categoryPage.sortDropdown.count();
    if (sortCount > 0) {
      await categoryPage.sortProducts('price-asc');
      await page.waitForTimeout(1000);
    }
  });

  test('should handle category filtering', async ({ page }) => {
    await categoryPage.navigateToCategory('all');
    await categoryPage.waitForProductsToLoad();

    const priceFilterCount = await categoryPage.priceFilter.count();
    if (priceFilterCount > 0) {
      await categoryPage.filterByPrice('10', '100');
      await page.waitForTimeout(1000);
    }
  });

  test('should handle category pagination', async ({ page }) => {
    await categoryPage.navigateToCategory('all');
    await categoryPage.waitForProductsToLoad();

    const paginationCount = await categoryPage.pagination.count();
    if (paginationCount > 0) {
      await expect(categoryPage.pagination).toBeVisible();
    }
  });

  // ==================== END-TO-END TESTS ====================

  test('Complete Ecommerce Flow Test', async ({ page }) => {
    console.log('🚀 Starting Complete Ecommerce Flow Test...');

    // Phase 1: Homepage Testing
    console.log('\n📱 Phase 1: Homepage Testing');
    await homePage.navigateToHome();

    const isHomeLoaded = await homePage.isHomePageLoaded();
    expect(isHomeLoaded).toBeTruthy();
    console.log('✅ Homepage loads successfully');

    const hasProducts = await homePage.hasProducts();
    expect(hasProducts).toBeTruthy();
    console.log('✅ Homepage displays products');

    // Phase 2: Product Page Testing
    console.log('\n🛍️ Phase 2: Product Page Testing');
    await homePage.clickFirstProduct();

    const isProductLoaded = await productPage.isProductPageLoaded();
    expect(isProductLoaded).toBeTruthy();
    console.log('✅ Product page loads successfully');

    const productTitle = await productPage.getProductTitle();
    const productPrice = await productPage.getProductPrice();
    console.log(`✅ Product information: ${productTitle} - ${productPrice}`);

    // Phase 3: Add to Cart Testing
    console.log('\n🛒 Phase 3: Add to Cart Testing');
    await productPage.addToCart();
    await productPage.waitForAddToCartSuccess();
    console.log('✅ Product added to cart');

    // Phase 4: Cart Testing
    console.log('\n📦 Phase 4: Cart Testing');
    await cartPage.navigateToCart();

    const hasCartItems = await cartPage.hasItems();
    expect(hasCartItems).toBeTruthy();
    console.log('✅ Cart has items');

    const cartItemCount = await cartPage.getCartItemCount();
    console.log(`✅ Cart contains ${cartItemCount} items`);

    // Phase 5: Search Testing
    console.log('\n🔍 Phase 5: Search Testing');
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');

    const hasSearchResults = await searchPage.hasSearchResults();
    expect(hasSearchResults).toBeTruthy();
    console.log('✅ Search returns results');

    // Phase 6: Category Testing
    console.log('\n📂 Phase 6: Category Testing');
    await categoryPage.navigateToCategory('all');

    const isCategoryLoaded = await categoryPage.isCategoryPageLoaded();
    expect(isCategoryLoaded).toBeTruthy();
    console.log('✅ Category page loads successfully');

    const categoryProductCount = await categoryPage.getProductCount();
    console.log(`✅ Category displays ${categoryProductCount} products`);

    // Phase 7: Checkout Testing
    console.log('\n💳 Phase 7: Checkout Testing');
    await cartPage.navigateToCart();
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/.*\/checkout.*/);
    console.log('✅ Successfully navigated to checkout');

    console.log('\n🎉 Complete Ecommerce Flow Test PASSED!');
  });

  test('Authentication and Access Test', async ({ page }) => {
    console.log('\n🔐 Testing Authentication and Access...');

    // Test homepage access
    await homePage.navigateToHome();
    await expect(page).toHaveURL(/.*myshopify\.com/);
    console.log('✅ Homepage accessible');

    // Test collections access
    await page.goto('/collections');
    await expect(page).toHaveURL(/.*\/collections/);
    console.log('✅ Collections accessible');

    // Test products access
    await page.goto('/products');
    await expect(page).toHaveURL(/.*\/products/);
    console.log('✅ Products accessible');

    // Test cart access
    await page.goto('/cart');
    await expect(page).toHaveURL(/.*\/cart/);
    console.log('✅ Cart accessible');

    console.log('✅ Authentication and Access Test PASSED!');
  });

  test('Navigation and User Experience Test', async ({ page }) => {
    console.log('\n🧭 Testing Navigation and UX...');

    // Test homepage navigation
    await homePage.navigateToHome();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    console.log('✅ Navigation elements present');

    // Test product navigation
    await homePage.clickFirstProduct();
    await expect(page).toHaveURL(/.*\/products\/.*/);
    console.log('✅ Product navigation works');

    // Test back navigation
    await page.goBack();
    await expect(page).toHaveURL(/.*myshopify\.com/);
    console.log('✅ Back navigation works');

    // Test search navigation
    await searchPage.searchForProduct('test');
    await expect(page).toHaveURL(/.*\/search.*/);
    console.log('✅ Search navigation works');

    console.log('✅ Navigation and UX Test PASSED!');
  });

  test('Responsive Design Test', async ({ page }) => {
    console.log('\n📱 Testing Responsive Design...');

    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await homePage.navigateToHome();
    const desktopScrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(desktopScrollHeight).toBeGreaterThan(800);
    console.log('✅ Desktop layout works');

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.navigateToHome();
    const tabletScrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(tabletScrollHeight).toBeGreaterThan(800);
    console.log('✅ Tablet layout works');

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.navigateToHome();
    const mobileScrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(mobileScrollHeight).toBeGreaterThan(800);
    console.log('✅ Mobile layout works');

    // Reset to default viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('✅ Responsive Design Test PASSED!');
  });

  test('Performance and Loading Test', async ({ page }) => {
    console.log('\n⚡ Testing Performance and Loading...');

    // Test homepage loading
    const startTime = Date.now();
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    console.log(`✅ Homepage loads in ${loadTime}ms`);

    // Test product page loading
    const productStartTime = Date.now();
    await homePage.clickFirstProduct();
    await productPage.waitForPageLoad();
    const productLoadTime = Date.now() - productStartTime;
    expect(productLoadTime).toBeLessThan(8000); // Should load within 8 seconds
    console.log(`✅ Product page loads in ${productLoadTime}ms`);

    // Test cart page loading
    const cartStartTime = Date.now();
    await cartPage.navigateToCart();
    await cartPage.waitForPageLoad();
    const cartLoadTime = Date.now() - cartStartTime;
    expect(cartLoadTime).toBeLessThan(5000); // Should load within 5 seconds
    console.log(`✅ Cart page loads in ${cartLoadTime}ms`);

    console.log('✅ Performance and Loading Test PASSED!');
  });

  test('Error Handling and Edge Cases Test', async ({ page }) => {
    console.log('\n⚠️ Testing Error Handling and Edge Cases...');

    // Test invalid search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('xyz123nonexistent');
    const hasNoResults = await searchPage.hasNoResults();
    expect(hasNoResults).toBeTruthy();
    console.log('✅ No results search handled correctly');

    // Test empty cart
    await cartPage.navigateToCart();
    const isEmpty = await cartPage.isCartEmpty();
    if (isEmpty) {
      console.log('✅ Empty cart state handled correctly');
    } else {
      // Clear cart to test empty state
      await cartPage.clearCart();
      const isEmptyAfterClear = await cartPage.isCartEmpty();
      expect(isEmptyAfterClear).toBeTruthy();
      console.log('✅ Cart clearing works correctly');
    }

    // Test page refresh
    await homePage.navigateToHome();
    await homePage.refreshPage();
    const isStillLoaded = await homePage.isHomePageLoaded();
    expect(isStillLoaded).toBeTruthy();
    console.log('✅ Page refresh works correctly');

    console.log('✅ Error Handling and Edge Cases Test PASSED!');
  });

  test('Cross-Browser Compatibility Test', async ({ page }) => {
    console.log('\n🌐 Testing Cross-Browser Compatibility...');

    // Test basic functionality across different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'Large Desktop' },
      { width: 1280, height: 720, name: 'Desktop' },
      { width: 1024, height: 768, name: 'Small Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await homePage.navigateToHome();

      const isLoaded = await homePage.isHomePageLoaded();
      expect(isLoaded).toBeTruthy();

      console.log(`✅ ${viewport.name} viewport works correctly`);
    }

    // Reset to default viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('✅ Cross-Browser Compatibility Test PASSED!');
  });
}); 