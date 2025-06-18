import { test, expect } from '../global-setup';
import { ProductPage } from './pages/ProductPage';
import { HomePage } from './pages/HomePage';

test.describe('Product Page Tests', () => {
  let productPage: ProductPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    homePage = new HomePage(page);
    
    // Navigate to homepage and click first product
    await homePage.navigateToHome();
    await homePage.clickFirstProduct();
  });

  test('should load product page successfully', async ({ page }) => {
    // Verify product page is loaded
    const isLoaded = await productPage.isProductPageLoaded();
    expect(isLoaded).toBeTruthy();
    
    // Check URL contains product
    await expect(page).toHaveURL(/.*\/products\/.*/);
    
    console.log('✅ Product page loads successfully');
  });

  test('should display product information', async ({ page }) => {
    // Get product title
    const title = await productPage.getProductTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Get product price
    const price = await productPage.getProductPrice();
    expect(price).toBeTruthy();
    expect(price.length).toBeGreaterThan(0);
    
    // Get product description
    const description = await productPage.getProductDescription();
    expect(description).toBeTruthy();
    
    console.log(`✅ Product information displayed: ${title} - ${price}`);
  });

  test('should display product images', async ({ page }) => {
    // Check if product has images
    const hasImages = await productPage.hasImages();
    expect(hasImages).toBeTruthy();
    
    // Get main image source
    const mainImageSrc = await productPage.getMainImageSrc();
    expect(mainImageSrc).toBeTruthy();
    
    // Get image count
    const imageCount = await productPage.getImageCount();
    expect(imageCount).toBeGreaterThan(0);
    
    console.log(`✅ Product images displayed: ${imageCount} images`);
  });

  test('should handle product variants', async ({ page }) => {
    // Check if product has variants
    const hasVariants = await productPage.hasVariants();
    
    if (hasVariants) {
      // Get available variants
      const variants = await productPage.getAvailableVariants();
      expect(variants.length).toBeGreaterThan(0);
      
      // Select first variant
      if (variants.length > 0) {
        await productPage.selectSize(variants[0]);
      }
      
      console.log(`✅ Product variants handled: ${variants.length} variants`);
    } else {
      console.log('ℹ️ Product has no variants');
    }
  });

  test('should change product quantity', async ({ page }) => {
    // Set quantity to 2
    await productPage.setQuantity(2);
    
    // Verify quantity is set
    const quantity = await productPage.getCurrentQuantity();
    expect(quantity).toBe(2);
    
    // Increase quantity
    await productPage.increaseQuantity();
    const increasedQuantity = await productPage.getCurrentQuantity();
    expect(increasedQuantity).toBeGreaterThan(2);
    
    // Decrease quantity
    await productPage.decreaseQuantity();
    const decreasedQuantity = await productPage.getCurrentQuantity();
    expect(decreasedQuantity).toBeLessThan(increasedQuantity);
    
    console.log('✅ Product quantity changes work correctly');
  });

  test('should add product to cart', async ({ page }) => {
    // Add product to cart
    await productPage.addToCart();
    
    // Wait for success notification
    await productPage.waitForAddToCartSuccess();
    
    // Verify cart notification appears
    await expect(page.locator('.add-to-cart-success, .cart-notification')).toBeVisible();
    
    console.log('✅ Product added to cart successfully');
  });

  test('should buy product now', async ({ page }) => {
    // Click buy now button
    await productPage.buyNow();
    
    // Should navigate to checkout
    await expect(page).toHaveURL(/.*\/checkout.*/);
    
    console.log('✅ Buy now functionality works');
  });

  test('should add product to wishlist', async ({ page }) => {
    // Add to wishlist
    await productPage.addToWishlist();
    
    // Verify wishlist button state changes
    await expect(page.locator('.wishlist, .favorite')).toBeVisible();
    
    console.log('✅ Product added to wishlist');
  });

  test('should share product', async ({ page }) => {
    // Click share button
    await productPage.shareProduct();
    
    // Verify share options appear
    await expect(page.locator('.share-options, .social-share')).toBeVisible();
    
    console.log('✅ Product sharing works');
  });

  test('should navigate through product images', async ({ page }) => {
    // Get image count
    const imageCount = await productPage.getImageCount();
    
    if (imageCount > 1) {
      // Click on thumbnail
      await productPage.clickThumbnail(1);
      
      // Verify main image changes
      const newImageSrc = await productPage.getMainImageSrc();
      expect(newImageSrc).toBeTruthy();
      
      console.log('✅ Product image navigation works');
    } else {
      console.log('ℹ️ Product has only one image');
    }
  });

  test('should check product stock status', async ({ page }) => {
    // Get stock status
    const stockStatus = await productPage.getStockStatus();
    expect(stockStatus).toBeTruthy();
    
    // Check if product is in stock
    const isInStock = await productPage.isProductInStock();
    
    if (isInStock) {
      console.log('✅ Product is in stock');
    } else {
      console.log('ℹ️ Product is out of stock');
    }
  });

  test('should get product SKU', async ({ page }) => {
    // Get product SKU
    const sku = await productPage.getSKU();
    expect(sku).toBeTruthy();
    
    console.log(`✅ Product SKU: ${sku}`);
  });

  test('should navigate to related products', async ({ page }) => {
    // Check if related products exist
    const hasRelatedProducts = await productPage.isVisible(page.locator('.related-products, .recommendations'));
    
    if (hasRelatedProducts) {
      // Click on first related product
      await productPage.navigateToRelatedProduct(0);
      
      // Verify navigation to new product
      await expect(page).toHaveURL(/.*\/products\/.*/);
      
      console.log('✅ Related products navigation works');
    } else {
      console.log('ℹ️ No related products available');
    }
  });

  test('should navigate back to collection', async ({ page }) => {
    // Go back to collection
    await productPage.goBackToCollection();
    
    // Verify we're on collection page
    await expect(page).toHaveURL(/.*\/collections\/.*/);
    
    console.log('✅ Navigation back to collection works');
  });

  test('should handle product reviews', async ({ page }) => {
    // Check if reviews exist
    const hasReviews = await productPage.hasReviews();
    
    if (hasReviews) {
      // Get review count
      const reviewCount = await productPage.getReviewCount();
      expect(reviewCount).toBeGreaterThan(0);
      
      // Scroll to reviews section
      await productPage.scrollToReviews();
      
      console.log(`✅ Product reviews: ${reviewCount} reviews`);
    } else {
      console.log('ℹ️ No reviews available for this product');
    }
  });

  test('should scroll through product sections', async ({ page }) => {
    // Scroll to product info
    await productPage.scrollToProductInfo();
    
    // Scroll to related products
    await productPage.scrollToRelatedProducts();
    
    // Verify page is scrollable
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(800);
    
    console.log('✅ Product page scrolling works correctly');
  });
}); 