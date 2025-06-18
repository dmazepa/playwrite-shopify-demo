import { test, expect } from '../global-setup';
import { HomePage } from './pages/HomePage';

test.describe('Homepage Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify homepage is loaded
    const isLoaded = await homePage.isHomePageLoaded();
    expect(isLoaded).toBeTruthy();
    
    // Check URL
    await expect(page).toHaveURL(/.*myshopify\.com/);
    
    console.log('✅ Homepage loads successfully');
  });

  test('should display products on homepage', async ({ page }) => {
    // Check if products are displayed
    const hasProducts = await homePage.hasProducts();
    expect(hasProducts).toBeTruthy();
    
    // Get product count
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`✅ Homepage displays ${productCount} products`);
  });

  test('should display product information', async ({ page }) => {
    // Get product titles
    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    
    // Get product prices
    const prices = await homePage.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    
    // Verify titles and prices match
    expect(titles.length).toBe(prices.length);
    
    console.log(`✅ Product information displayed: ${titles.length} products`);
  });

  test('should navigate to first product', async ({ page }) => {
    // Click on first product
    await homePage.clickFirstProduct();
    
    // Verify navigation to product page
    await expect(page).toHaveURL(/.*\/products\/.*/);
    
    console.log('✅ Successfully navigated to product page');
  });

  test('should add first product to cart', async ({ page }) => {
    // Add first product to cart
    await homePage.addFirstProductToCart();
    
    // Wait for cart update
    await homePage.waitForElement(page.locator('.cart-count, .cart-badge'), 5000);
    
    // Check cart count increased
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBeTruthy();
    
    console.log('✅ Successfully added product to cart');
  });

  test('should have working search functionality', async ({ page }) => {
    // Check if search is available
    const isSearchWorking = await homePage.isSearchWorking();
    expect(isSearchWorking).toBeTruthy();
    
    // Test search with a query
    await homePage.searchForProduct('test');
    
    // Verify search results page
    await expect(page).toHaveURL(/.*\/search.*/);
    
    console.log('✅ Search functionality works');
  });

  test('should have accessible cart', async ({ page }) => {
    // Check if cart is accessible
    const isCartAccessible = await homePage.isCartAccessible();
    expect(isCartAccessible).toBeTruthy();
    
    // Open cart
    await homePage.openCart();
    
    // Verify cart is opened (could be drawer or page)
    await expect(page.locator('.cart-container, .cart-drawer')).toBeVisible();
    
    console.log('✅ Cart is accessible');
  });

  test('should navigate to collections', async ({ page }) => {
    // Try to navigate to a collection
    await homePage.navigateToCollection('all');
    
    // Verify we're on collections page
    await expect(page).toHaveURL(/.*\/collections\/.*/);
    
    console.log('✅ Successfully navigated to collections');
  });

  test('should have responsive design elements', async ({ page }) => {
    // Check for header
    await expect(page.locator('header')).toBeVisible();
    
    // Check for navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for footer
    await expect(page.locator('footer')).toBeVisible();
    
    console.log('✅ Responsive design elements are present');
  });

  test('should scroll through page sections', async ({ page }) => {
    // Scroll to products section
    await homePage.scrollToProducts();
    
    // Scroll to footer
    await homePage.scrollToFooter();
    
    // Verify page is scrollable
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(800);
    
    console.log('✅ Page scrolling works correctly');
  });

  test('should refresh page successfully', async ({ page }) => {
    // Refresh the page
    await homePage.refreshPage();
    
    // Verify page still loads
    const isLoaded = await homePage.isHomePageLoaded();
    expect(isLoaded).toBeTruthy();
    
    console.log('✅ Page refresh works correctly');
  });
}); 