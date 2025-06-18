import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  // Locators
  public readonly categoryTitle: Locator;
  public readonly categoryDescription: Locator;
  public readonly categoryImage: Locator;
  public readonly productGrid: Locator;
  public readonly productCards: Locator;
  public readonly categoryFilters: Locator;
  public readonly sortDropdown: Locator;
  public readonly viewToggle: Locator;
  public readonly pagination: Locator;
  public readonly breadcrumbs: Locator;
  public readonly subcategories: Locator;
  public readonly categoryTags: Locator;
  public readonly productCount: Locator;
  public readonly categoryBanner: Locator;
  public readonly categorySidebar: Locator;
  public readonly filterToggle: Locator;
  public readonly clearFiltersButton: Locator;
  public readonly activeFilters: Locator;
  public readonly categorySorting: Locator;
  public readonly categoryView: Locator;

  public get priceFilter() {
    return this.page.locator('.price-filter, .price-range, [data-price-filter]');
  }

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.categoryTitle = page.locator('.collection-hero__title, .collection-title, h1');
    this.categoryDescription = page.locator('.category-description, .collection-description');
    this.categoryImage = page.locator('.category-image, .collection-image');
    this.productGrid = page.locator('.product-grid, #product-grid, [data-product-grid]');
    this.productCards = page.locator('.grid__item, .product-item, [data-product-card]');
    this.categoryFilters = page.locator('.category-filters, .filter-sidebar, [data-category-filters]');
    this.sortDropdown = page.locator('.sort-dropdown, .sort-select, [data-sort]');
    this.viewToggle = page.locator('.view-toggle, .view-mode, [data-view-toggle]');
    this.pagination = page.locator('.pagination, .category-pagination, [data-pagination]');
    this.breadcrumbs = page.locator('.breadcrumbs, .breadcrumb');
    this.subcategories = page.locator('.subcategories, .sub-collections, [data-subcategories]');
    this.categoryTags = page.locator('.category-tags, .collection-tags, [data-category-tags]');
    this.productCount = page.locator('.product-count, .results-count, [data-product-count]');
    this.categoryBanner = page.locator('.category-banner, .collection-banner');
    this.categorySidebar = page.locator('.category-sidebar, .collection-sidebar');
    this.filterToggle = page.locator('.filter-toggle, .mobile-filter-toggle');
    this.clearFiltersButton = page.locator('.clear-filters, .reset-filters');
    this.activeFilters = page.locator('.active-filter, .selected-filter');
    this.categorySorting = page.locator('.category-sorting, .collection-sorting');
    this.categoryView = page.locator('.category-view, .collection-view');
  }

  // Navigation methods
  async navigateToCategory(categoryHandle: string) {
    await this.goto(`/collections/${categoryHandle}`);
  }

  async navigateToSubcategory(subcategoryHandle: string) {
    const subcategoryLink = this.subcategories.locator(`[href*="/collections/${subcategoryHandle}"]`);
    await this.clickElement(subcategoryLink);
  }

  async goBackToParentCategory() {
    const parentLink = this.breadcrumbs.locator('a').nth(-2);
    await this.clickElement(parentLink);
  }

  // Category information methods
  async getCategoryTitle(): Promise<string> {
    return await this.getText(this.categoryTitle);
  }

  async getCategoryDescription(): Promise<string> {
    return await this.getText(this.categoryDescription);
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async getProductCountText(): Promise<string> {
    return await this.getText(this.productCount);
  }

  // Product methods
  async getProductTitles(): Promise<string[]> {
    const titles = this.productCards.locator('.product-title, .product-name, h3');
    const titleElements = await titles.all();
    return (await Promise.all(titleElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  async getProductPrices(): Promise<string[]> {
    const prices = this.productCards.locator('.product-price, .price, [data-price]');
    const priceElements = await prices.all();
    return (await Promise.all(priceElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  async clickProduct(index: number) {
    const products = await this.productCards.all();
    if (products[index]) {
      await this.clickElement(products[index]);
    }
  }

  async addProductToCart(index: number) {
    const products = await this.productCards.all();
    if (products[index]) {
      const addToCartButton = products[index].locator('.add-to-cart, [data-add-to-cart]');
      await this.clickElement(addToCartButton);
    }
  }

  async getProductImages(): Promise<string[]> {
    const images = this.productCards.locator('img');
    const imageElements = await images.all();
    return (await Promise.all(imageElements.map(el => el.getAttribute('src')))).filter(Boolean) as string[];
  }

  // Filter methods
  async applyFilter(filterType: string, filterValue: string) {
    const filter = this.categoryFilters.locator(`[data-filter="${filterType}"]`);
    const filterOption = filter.locator(`[data-value="${filterValue}"]`);
    await this.clickElement(filterOption);
  }

  async clearAllFilters() {
    await this.clickElement(this.clearFiltersButton);
  }

  async getActiveFilters(): Promise<string[]> {
    const activeFilters = this.activeFilters;
    const activeFilterElements = await activeFilters.all();
    return (await Promise.all(activeFilterElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  async removeFilter(filterIndex: number) {
    const activeFilters = await this.activeFilters.all();
    if (activeFilters[filterIndex]) {
      const removeButton = activeFilters[filterIndex].locator('.remove-filter, .close-filter');
      await this.clickElement(removeButton);
    }
  }

  // Sort methods
  async sortBy(sortOption: string) {
    await this.sortDropdown.selectOption(sortOption);
  }

  async sortProducts(sortOption: string) {
    await this.sortDropdown.selectOption(sortOption);
  }

  async filterByPrice(minPrice: string, maxPrice: string) {
    const minInput = this.priceFilter.locator('input[name="min-price"]');
    const maxInput = this.priceFilter.locator('input[name="max-price"]');
    await this.fillInput(minInput, minPrice);
    await this.fillInput(maxInput, maxPrice);
  }

  async getSortOptions(): Promise<string[]> {
    const options = this.sortDropdown.locator('option');
    const optionElements = await options.all();
    return (await Promise.all(optionElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  async getCurrentSort(): Promise<string> {
    return await this.sortDropdown.inputValue();
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

  async switchToCompactView() {
    const compactButton = this.viewToggle.locator('.compact-view, [data-view="compact"]');
    await this.clickElement(compactButton);
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

  // Subcategory methods
  async getSubcategories(): Promise<string[]> {
    const subcategoryElements = await this.subcategories.all();
    return (await Promise.all(subcategoryElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  async clickSubcategory(index: number) {
    const subcategoryLinks = this.subcategories.locator('a');
    const links = await subcategoryLinks.all();
    if (links[index]) {
      await this.clickElement(links[index]);
    }
  }

  // Tag methods
  async getCategoryTags(): Promise<string[]> {
    const tags = this.categoryTags;
    const tagElements = await tags.all();
    return (await Promise.all(tagElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  async clickCategoryTag(index: number) {
    const tags = this.categoryTags.locator('.tag, .category-tag');
    const tagElements = await tags.all();
    if (tagElements[index]) {
      await this.clickElement(tagElements[index]);
    }
  }

  // Mobile filter methods
  async openMobileFilters() {
    await this.clickElement(this.filterToggle);
  }

  async closeMobileFilters() {
    const closeButton = this.page.locator('.filter-close, .mobile-filter-close');
    await this.clickElement(closeButton);
  }

  // Validation methods
  async isCategoryPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.categoryTitle) && await this.isVisible(this.productGrid);
  }

  async hasProducts(): Promise<boolean> {
    const count = await this.getProductCount();
    return count > 0;
  }

  async hasFilters(): Promise<boolean> {
    return await this.isVisible(this.categoryFilters);
  }

  async hasSubcategories(): Promise<boolean> {
    return await this.isVisible(this.subcategories);
  }

  async hasPagination(): Promise<boolean> {
    return await this.isVisible(this.pagination);
  }

  // Utility methods
  async scrollToProducts() {
    await this.productGrid.scrollIntoViewIfNeeded();
  }

  async scrollToFilters() {
    await this.categoryFilters.scrollIntoViewIfNeeded();
  }

  async scrollToPagination() {
    await this.pagination.scrollIntoViewIfNeeded();
  }

  async refreshCategory() {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async waitForProductsToLoad() {
    await this.page.waitForSelector('.product-card, .product-item', { timeout: 10000 });
  }

  async waitForFiltersToLoad() {
    await this.page.waitForSelector('.category-filters, .filter-sidebar', { timeout: 5000 });
  }
} 