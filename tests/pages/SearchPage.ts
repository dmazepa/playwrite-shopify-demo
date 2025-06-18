import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  // Locators
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchResults: Locator;
  private readonly searchResultItem: Locator;
  private readonly searchSuggestions: Locator;
  private readonly searchFilters: Locator;
  private readonly sortDropdown: Locator;
  private readonly viewToggle: Locator;
  private readonly pagination: Locator;
  private readonly noResultsMessage: Locator;
  private readonly searchHistory: Locator;
  private readonly popularSearches: Locator;
  private readonly searchCategories: Locator;
  private readonly searchTags: Locator;
  private readonly searchBreadcrumb: Locator;
  private readonly searchCount: Locator;
  private readonly searchLoading: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.searchInput = page.locator('input[type="search"], input[name="q"], .search__input');
    this.searchButton = page.locator('button[type="submit"], .search__button, .search-submit');
    this.searchResults = page.locator('.template-search__results, .search-results-grid, [data-search-results]');
    this.searchResultItem = page.locator('.grid__item, .product-item, [data-search-result]');
    this.searchSuggestions = page.locator('#predictive-search-results, .autocomplete, [data-search-suggestions]');
    this.searchFilters = page.locator('.search-filters, .filter-sidebar, [data-search-filters]');
    this.sortDropdown = page.locator('.sort-dropdown, .sort-select, [data-sort]');
    this.viewToggle = page.locator('.view-toggle, .view-mode, [data-view-toggle]');
    this.pagination = page.locator('.pagination, .search-pagination, [data-pagination]');
    this.noResultsMessage = page.locator('.template-search [role="status"], .search-no-results, [data-no-results]');
    this.searchHistory = page.locator('.search-history, .recent-searches, [data-search-history]');
    this.popularSearches = page.locator('.popular-searches, .trending-searches, [data-popular-searches]');
    this.searchCategories = page.locator('.search-categories, .category-filters, [data-search-categories]');
    this.searchTags = page.locator('.search-tags, .tag-filters, [data-search-tags]');
    this.searchBreadcrumb = page.locator('.search-breadcrumb, .search-crumb, [data-search-breadcrumb]');
    this.searchCount = page.locator('.search-count, .results-count, [data-search-count]');
    this.searchLoading = page.locator('.search-loading, .loading-spinner, [data-search-loading]');
  }

  // Search methods
  async searchForProduct(query: string) {
    await this.fillInput(this.searchInput, query);
    await this.clickElement(this.searchButton);
    await this.waitForSearchResults();
  }

  async searchWithEnter(query: string) {
    await this.fillInput(this.searchInput, query);
    await this.page.keyboard.press('Enter');
    await this.waitForSearchResults();
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async getSearchQuery(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  // Search results methods
  async getSearchResultsCount(): Promise<number> {
    return await this.searchResultItem.count();
  }

  async getSearchResultTitle(index: number): Promise<string> {
    const results = await this.searchResultItem.all();
    if (results[index]) {
      return await this.getText(results[index].locator('.product-title, .item-title'));
    }
    return '';
  }

  async getSearchResultPrice(index: number): Promise<string> {
    const results = await this.searchResultItem.all();
    if (results[index]) {
      return await this.getText(results[index].locator('.product-price, .item-price'));
    }
    return '';
  }

  async clickSearchResult(index: number) {
    const results = await this.searchResultItem.all();
    if (results[index]) {
      await this.clickElement(results[index]);
    }
  }

  async addSearchResultToCart(index: number) {
    const results = await this.searchResultItem.all();
    if (results[index]) {
      const addToCartButton = results[index].locator('.add-to-cart, [data-add-to-cart]');
      await this.clickElement(addToCartButton);
    }
  }

  // Search suggestions methods
  async getSearchSuggestions(): Promise<string[]> {
    const suggestions = await this.searchSuggestions.locator('.suggestion-item, .autocomplete-item').all();
    return (await Promise.all(suggestions.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  async clickSearchSuggestion(index: number) {
    const suggestions = await this.searchSuggestions.locator('.suggestion-item, .autocomplete-item').all();
    if (suggestions[index]) {
      await this.clickElement(suggestions[index]);
    }
  }

  async isSearchSuggestionsVisible(): Promise<boolean> {
    return await this.isVisible(this.searchSuggestions);
  }

  // Filter methods
  public getFilterOptions() {
    return this.searchFilters.locator('.filter-option, [data-filter-option]');
  }

  async applyFilter(filterIndex: number) {
    const filterOptions = await this.getFilterOptions().all();
    if (filterOptions[filterIndex]) {
      await this.clickElement(filterOptions[filterIndex]);
    }
  }

  async clearFilters() {
    const clearButton = this.searchFilters.locator('.clear-filters, .reset-filters');
    await this.clickElement(clearButton);
  }

  async getActiveFilters(): Promise<string[]> {
    const activeFilters = this.searchFilters.locator('.active-filter, .selected-filter');
    const filterElements = await activeFilters.all();
    return (await Promise.all(filterElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  // Sort methods
  async sortBy(sortOption: string) {
    await this.sortDropdown.selectOption(sortOption);
  }

  async getSortOptions(): Promise<string[]> {
    const options = this.sortDropdown.locator('option');
    const optionElements = await options.all();
    return (await Promise.all(optionElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  // View methods
  async switchToGridView() {
    const gridButton = this.viewToggle.locator('.grid-view, [data-view="grid"]');
    await this.clickElement(gridButton);
  }

  async switchToListView() {
    const listButton = this.viewToggle.locator('.list-view, [data-view="list"]');
    await this.clickElement(listButton);
  }

  // Pagination methods
  async goToNextPage() {
    const nextButton = this.pagination.locator('.next-page, .pagination-next');
    await this.clickElement(nextButton);
  }

  async goToPreviousPage() {
    const prevButton = this.pagination.locator('.prev-page, .pagination-prev');
    await this.clickElement(prevButton);
  }

  async goToPage(pageNumber: number) {
    const pageButton = this.pagination.locator(`[data-page="${pageNumber}"]`);
    await this.clickElement(pageButton);
  }

  async getCurrentPage(): Promise<number> {
    const currentPage = this.pagination.locator('.current-page, .active-page');
    const pageText = await this.getText(currentPage);
    return parseInt(pageText) || 1;
  }

  async getTotalPages(): Promise<number> {
    const pageButtons = this.pagination.locator('[data-page]');
    const pages = await pageButtons.all();
    return pages.length;
  }

  // Category and tag methods
  async clickSearchCategory(categoryName: string) {
    const categoryLink = this.searchCategories.locator(`[data-category="${categoryName}"]`);
    await this.clickElement(categoryLink);
  }

  async clickSearchTag(tagName: string) {
    const tagLink = this.searchTags.locator(`[data-tag="${tagName}"]`);
    await this.clickElement(tagLink);
  }

  // History and popular searches
  async clickRecentSearch(index: number) {
    const recentSearches = this.searchHistory.locator('.recent-search-item');
    const searches = await recentSearches.all();
    if (searches[index]) {
      await this.clickElement(searches[index]);
    }
  }

  async clickPopularSearch(index: number) {
    const popularSearches = this.popularSearches.locator('.popular-search-item');
    const searches = await popularSearches.all();
    if (searches[index]) {
      await this.clickElement(searches[index]);
    }
  }

  async clearSearchHistory() {
    const clearButton = this.searchHistory.locator('.clear-history');
    await this.clickElement(clearButton);
  }

  // Validation methods
  async hasSearchResults(): Promise<boolean> {
    const count = await this.getSearchResultsCount();
    return count > 0;
  }

  async hasNoResults(): Promise<boolean> {
    return await this.isVisible(this.noResultsMessage);
  }

  async isSearchPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.searchInput) && await this.isVisible(this.searchResults);
  }

  async getSearchResultsCountText(): Promise<string> {
    return await this.getText(this.searchCount);
  }

  // Utility methods
  async waitForSearchResults() {
    await this.page.waitForSelector('.search-result-item, .product-item', { timeout: 10000 });
  }

  async waitForSearchLoading() {
    await this.page.waitForSelector('.search-loading, .loading-spinner', { timeout: 5000 });
  }

  async scrollToSearchResults() {
    await this.searchResults.scrollIntoViewIfNeeded();
  }

  async scrollToFilters() {
    await this.searchFilters.scrollIntoViewIfNeeded();
  }

  async refreshSearchResults() {
    await this.page.reload();
    await this.waitForPageLoad();
  }
} 