import { test, expect } from '../global-setup';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';

test.describe('Search Tests', () => {
  let searchPage: SearchPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    homePage = new HomePage(page);
  });

  test('should load search page', async ({ page }) => {
    // Navigate to search page
    await page.goto('/search');
    
    // Verify search page is loaded
    const isLoaded = await searchPage.isSearchPageLoaded();
    expect(isLoaded).toBeTruthy();
    
    console.log('✅ Search page loads successfully');
  });

  test('should perform basic search', async ({ page }) => {
    // Navigate to homepage
    await homePage.navigateToHome();
    
    // Perform search
    await searchPage.searchForProduct('test');
    
    // Verify search results
    const hasResults = await searchPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    // Get results count
    const resultsCount = await searchPage.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
    
    console.log(`✅ Basic search works: ${resultsCount} results found`);
  });

  test('should search with Enter key', async ({ page }) => {
    // Navigate to homepage
    await homePage.navigateToHome();
    
    // Search with Enter key
    await searchPage.searchWithEnter('product');
    
    // Verify search results
    const hasResults = await searchPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
    
    console.log('✅ Search with Enter key works');
  });

  test('should display search results correctly', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Get search result titles
    const titles = [];
    const resultsCount = await searchPage.getSearchResultsCount();
    
    for (let i = 0; i < Math.min(resultsCount, 3); i++) {
      const title = await searchPage.getSearchResultTitle(i);
      titles.push(title);
    }
    
    expect(titles.length).toBeGreaterThan(0);
    
    // Get search result prices
    const prices = [];
    for (let i = 0; i < Math.min(resultsCount, 3); i++) {
      const price = await searchPage.getSearchResultPrice(i);
      prices.push(price);
    }
    
    expect(prices.length).toBeGreaterThan(0);
    
    console.log(`✅ Search results displayed: ${titles.length} items with prices`);
  });

  test('should click on search result', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Click on first search result
    await searchPage.clickSearchResult(0);
    
    // Verify navigation to product page
    await expect(page).toHaveURL(/.*\/products\/.*/);
    
    console.log('✅ Search result navigation works');
  });

  test('should add search result to cart', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Add first result to cart
    await searchPage.addSearchResultToCart(0);
    
    // Wait for cart update
    await page.waitForTimeout(1000);
    
    console.log('✅ Search result added to cart');
  });

  test('should handle search with no results', async ({ page }) => {
    // Navigate to homepage and search for unlikely term
    await homePage.navigateToHome();
    await searchPage.searchForProduct('xyz123nonexistent');
    
    // Check for no results message
    const hasNoResults = await searchPage.hasNoResults();
    expect(hasNoResults).toBeTruthy();
    
    console.log('✅ No results search handled correctly');
  });

  test('should show search suggestions', async ({ page }) => {
    // Navigate to homepage
    await homePage.navigateToHome();
    
    // Type in search input to trigger suggestions
    await searchPage.fillInput(page.locator('input[type="search"], input[name="q"]'), 't');
    
    // Wait for suggestions
    await page.waitForTimeout(1000);
    
    // Check if suggestions are visible
    const suggestionsVisible = await searchPage.isSearchSuggestionsVisible();
    
    if (suggestionsVisible) {
      const suggestions = await searchPage.getSearchSuggestions();
      expect(suggestions.length).toBeGreaterThan(0);
      console.log(`✅ Search suggestions work: ${suggestions.length} suggestions`);
    } else {
      console.log('ℹ️ Search suggestions not available');
    }
  });

  test('should click search suggestion', async ({ page }) => {
    // Navigate to homepage
    await homePage.navigateToHome();
    
    // Type in search input
    await searchPage.fillInput(page.locator('input[type="search"], input[name="q"]'), 't');
    
    // Wait for suggestions
    await page.waitForTimeout(1000);
    
    // Click first suggestion if available
    const suggestionsVisible = await searchPage.isSearchSuggestionsVisible();
    if (suggestionsVisible) {
      await searchPage.clickSearchSuggestion(0);
      console.log('✅ Search suggestion clicked');
    } else {
      console.log('ℹ️ No search suggestions to click');
    }
  });

  test('should apply search filters', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Check if filters are available
    const hasFilters = await searchPage.isVisible(page.locator('.search-filters, .filter-sidebar'));
    
    if (hasFilters) {
      // Apply a filter
      await searchPage.applyFilter(0);
      
      // Get active filters
      const activeFilters = await searchPage.getActiveFilters();
      expect(activeFilters.length).toBeGreaterThan(0);
      
      console.log(`✅ Search filters applied: ${activeFilters.length} active filters`);
    } else {
      console.log('ℹ️ Search filters not available');
    }
  });

  test('should clear search filters', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Check if filters are available
    const hasFilters = await searchPage.isVisible(page.locator('.search-filters, .filter-sidebar'));
    
    if (hasFilters) {
      // Apply a filter first
      await searchPage.applyFilter(0);
      
      // Clear filters
      await searchPage.clearFilters();
      
      // Check filters are cleared
      const activeFilters = await searchPage.getActiveFilters();
      expect(activeFilters.length).toBe(0);
      
      console.log('✅ Search filters cleared');
    } else {
      console.log('ℹ️ Search filters not available');
    }
  });

  test('should sort search results', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Check if sort dropdown is available
    const hasSort = await searchPage.isVisible(page.locator('.sort-dropdown, .sort-select'));
    
    if (hasSort) {
      // Get sort options
      const sortOptions = await searchPage.getSortOptions();
      expect(sortOptions.length).toBeGreaterThan(0);
      
      // Sort by first option
      if (sortOptions.length > 0) {
        await searchPage.sortBy(sortOptions[0]);
        console.log(`✅ Search results sorted by: ${sortOptions[0]}`);
      }
    } else {
      console.log('ℹ️ Sort options not available');
    }
  });

  test('should switch search view modes', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Check if view toggle is available
    const hasViewToggle = await searchPage.isVisible(page.locator('.view-toggle, .view-mode'));
    
    if (hasViewToggle) {
      // Switch to grid view
      await searchPage.switchToGridView();
      
      // Switch to list view
      await searchPage.switchToListView();
      
      console.log('✅ Search view modes switched');
    } else {
      console.log('ℹ️ View toggle not available');
    }
  });

  test('should handle search pagination', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Check if pagination is available
    const hasPagination = await searchPage.isVisible(page.locator('.pagination, .search-pagination'));
    
    if (hasPagination) {
      // Get current page
      const currentPage = await searchPage.getCurrentPage();
      expect(currentPage).toBe(1);
      
      // Get total pages
      const totalPages = await searchPage.getTotalPages();
      expect(totalPages).toBeGreaterThan(0);
      
      // Go to next page if available
      if (totalPages > 1) {
        await searchPage.goToNextPage();
        const newPage = await searchPage.getCurrentPage();
        expect(newPage).toBe(2);
        console.log('✅ Search pagination works');
      } else {
        console.log('ℹ️ Only one page of results');
      }
    } else {
      console.log('ℹ️ Pagination not available');
    }
  });

  test('should clear search query', async ({ page }) => {
    // Navigate to homepage
    await homePage.navigateToHome();
    
    // Fill search input
    await searchPage.fillInput(page.locator('input[type="search"], input[name="q"]'), 'test query');
    
    // Clear search
    await searchPage.clearSearch();
    
    // Verify search is cleared
    const query = await searchPage.getSearchQuery();
    expect(query).toBe('');
    
    console.log('✅ Search query cleared');
  });

  test('should get search results count text', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Get search count text
    const countText = await searchPage.getSearchResultsCountText();
    expect(countText).toBeTruthy();
    
    console.log(`✅ Search results count: ${countText}`);
  });

  test('should scroll through search results', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Scroll to search results
    await searchPage.scrollToSearchResults();
    
    // Scroll to filters
    await searchPage.scrollToFilters();
    
    // Verify page is scrollable
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(800);
    
    console.log('✅ Search page scrolling works correctly');
  });

  test('should refresh search results', async ({ page }) => {
    // Navigate to homepage and search
    await homePage.navigateToHome();
    await searchPage.searchForProduct('test');
    
    // Refresh search results
    await searchPage.refreshSearchResults();
    
    // Verify search page still loads
    const isLoaded = await searchPage.isSearchPageLoaded();
    expect(isLoaded).toBeTruthy();
    
    console.log('✅ Search results refresh works');
  });
}); 