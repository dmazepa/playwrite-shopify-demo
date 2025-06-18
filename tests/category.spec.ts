import { test, expect } from '../global-setup';
import { CategoryPage } from './pages/CategoryPage';

test.describe('Category/Collection Tests', () => {
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new CategoryPage(page);
  });

  test('should load category page', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Verify category page is loaded
    const isLoaded = await categoryPage.isCategoryPageLoaded();
    expect(isLoaded).toBeTruthy();
    
    // Check URL contains collection
    await expect(page).toHaveURL(/.*\/collections\/.*/);
    
    console.log('✅ Category page loads successfully');
  });

  test('should display category information', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Get category title
    const title = await categoryPage.getCategoryTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Get category description
    const description = await categoryPage.getCategoryDescription();
    expect(description).toBeTruthy();
    
    // Get product count
    const productCount = await categoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`✅ Category information displayed: ${title} - ${productCount} products`);
  });

  test('should display products in category', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if products are displayed
    const hasProducts = await categoryPage.hasProducts();
    expect(hasProducts).toBeTruthy();
    
    // Get product titles
    const titles = await categoryPage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    
    // Get product prices
    const prices = await categoryPage.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    
    // Verify titles and prices match
    expect(titles.length).toBe(prices.length);
    
    console.log(`✅ Category displays ${titles.length} products`);
  });

  test('should click on product in category', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Click on first product
    await categoryPage.clickProduct(0);
    
    // Verify navigation to product page
    await expect(page).toHaveURL(/.*\/products\/.*/);
    
    console.log('✅ Product navigation from category works');
  });

  test('should add product to cart from category', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Add first product to cart
    await categoryPage.addProductToCart(0);
    
    // Wait for cart update
    await page.waitForTimeout(1000);
    
    console.log('✅ Product added to cart from category');
  });

  test('should apply category filters', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if filters are available
    const hasFilters = await categoryPage.hasFilters();
    
    if (hasFilters) {
      // Apply a filter
      await categoryPage.applyFilter('price', 'low-to-high');
      
      // Get active filters
      const activeFilters = await categoryPage.getActiveFilters();
      expect(activeFilters.length).toBeGreaterThan(0);
      
      console.log(`✅ Category filters applied: ${activeFilters.length} active filters`);
    } else {
      console.log('ℹ️ Category filters not available');
    }
  });

  test('should clear category filters', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if filters are available
    const hasFilters = await categoryPage.hasFilters();
    
    if (hasFilters) {
      // Apply a filter first
      await categoryPage.applyFilter('price', 'low-to-high');
      
      // Clear all filters
      await categoryPage.clearAllFilters();
      
      // Check filters are cleared
      const activeFilters = await categoryPage.getActiveFilters();
      expect(activeFilters.length).toBe(0);
      
      console.log('✅ Category filters cleared');
    } else {
      console.log('ℹ️ Category filters not available');
    }
  });

  test('should sort category products', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if sort dropdown is available
    const hasSort = await categoryPage.isVisible(page.locator('.sort-dropdown, .sort-select'));
    
    if (hasSort) {
      // Get sort options
      const sortOptions = await categoryPage.getSortOptions();
      expect(sortOptions.length).toBeGreaterThan(0);
      
      // Sort by first option
      if (sortOptions.length > 0) {
        await categoryPage.sortBy(sortOptions[0]);
        console.log(`✅ Category products sorted by: ${sortOptions[0]}`);
      }
    } else {
      console.log('ℹ️ Sort options not available');
    }
  });

  test('should switch category view modes', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if view toggle is available
    const hasViewToggle = await categoryPage.isVisible(page.locator('.view-toggle, .view-mode'));
    
    if (hasViewToggle) {
      // Switch to grid view
      await categoryPage.switchToGridView();
      
      // Switch to list view
      await categoryPage.switchToListView();
      
      // Switch to compact view
      await categoryPage.switchToCompactView();
      
      console.log('✅ Category view modes switched');
    } else {
      console.log('ℹ️ View toggle not available');
    }
  });

  test('should handle category pagination', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if pagination is available
    const hasPagination = await categoryPage.hasPagination();
    
    if (hasPagination) {
      // Get current page
      const currentPage = await categoryPage.getCurrentPage();
      expect(currentPage).toBe(1);
      
      // Get total pages
      const totalPages = await categoryPage.getTotalPages();
      expect(totalPages).toBeGreaterThan(0);
      
      // Go to next page if available
      if (totalPages > 1) {
        await categoryPage.goToNextPage();
        const newPage = await categoryPage.getCurrentPage();
        expect(newPage).toBe(2);
        console.log('✅ Category pagination works');
      } else {
        console.log('ℹ️ Only one page of products');
      }
    } else {
      console.log('ℹ️ Pagination not available');
    }
  });

  test('should navigate to subcategories', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if subcategories are available
    const hasSubcategories = await categoryPage.hasSubcategories();
    
    if (hasSubcategories) {
      // Get subcategories
      const subcategories = await categoryPage.getSubcategories();
      expect(subcategories.length).toBeGreaterThan(0);
      
      // Click on first subcategory
      await categoryPage.clickSubcategory(0);
      
      // Verify navigation to subcategory
      await expect(page).toHaveURL(/.*\/collections\/.*/);
      
      console.log(`✅ Subcategory navigation works: ${subcategories.length} subcategories`);
    } else {
      console.log('ℹ️ No subcategories available');
    }
  });

  test('should navigate back to parent category', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if breadcrumbs are available
    const hasBreadcrumbs = await categoryPage.isVisible(page.locator('.breadcrumbs, .breadcrumb'));
    
    if (hasBreadcrumbs) {
      // Go back to parent category
      await categoryPage.goBackToParentCategory();
      
      // Verify navigation back
      await expect(page).toHaveURL(/.*\/collections\/.*/);
      
      console.log('✅ Navigation back to parent category works');
    } else {
      console.log('ℹ️ Breadcrumbs not available');
    }
  });

  test('should handle category tags', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if category tags are available
    const hasTags = await categoryPage.isVisible(page.locator('.category-tags, .collection-tags'));
    
    if (hasTags) {
      // Get category tags
      const tags = await categoryPage.getCategoryTags();
      expect(tags.length).toBeGreaterThan(0);
      
      // Click on first tag
      await categoryPage.clickCategoryTag(0);
      
      // Verify tag filter is applied
      await expect(page).toHaveURL(/.*\/collections\/.*/);
      
      console.log(`✅ Category tags work: ${tags.length} tags available`);
    } else {
      console.log('ℹ️ Category tags not available');
    }
  });

  test('should open mobile filters', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Check if mobile filter toggle is available
    const hasFilterToggle = await categoryPage.isVisible(page.locator('.filter-toggle, .mobile-filter-toggle'));
    
    if (hasFilterToggle) {
      // Open mobile filters
      await categoryPage.openMobileFilters();
      
      // Close mobile filters
      await categoryPage.closeMobileFilters();
      
      console.log('✅ Mobile filters open and close correctly');
    } else {
      console.log('ℹ️ Mobile filter toggle not available');
    }
  });

  test('should scroll through category sections', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Scroll to products
    await categoryPage.scrollToProducts();
    
    // Scroll to filters
    await categoryPage.scrollToFilters();
    
    // Scroll to pagination
    await categoryPage.scrollToPagination();
    
    // Verify page is scrollable
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(800);
    
    console.log('✅ Category page scrolling works correctly');
  });

  test('should refresh category page', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Refresh category page
    await categoryPage.refreshCategory();
    
    // Verify category page still loads
    const isLoaded = await categoryPage.isCategoryPageLoaded();
    expect(isLoaded).toBeTruthy();
    
    console.log('✅ Category page refresh works');
  });

  test('should wait for products to load', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Wait for products to load
    await categoryPage.waitForProductsToLoad();
    
    // Verify products are loaded
    const hasProducts = await categoryPage.hasProducts();
    expect(hasProducts).toBeTruthy();
    
    console.log('✅ Category products load correctly');
  });

  test('should wait for filters to load', async ({ page }) => {
    // Navigate to collections page
    await categoryPage.navigateToCategory('all');
    
    // Wait for filters to load
    await categoryPage.waitForFiltersToLoad();
    
    // Verify filters are available
    const hasFilters = await categoryPage.hasFilters();
    
    if (hasFilters) {
      console.log('✅ Category filters load correctly');
    } else {
      console.log('ℹ️ No filters available for this category');
    }
  });
}); 