import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  public readonly header: Locator;
  private readonly navigation: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly productGrid: Locator;
  private readonly productCards: Locator;
  private readonly cartIcon: Locator;
  private readonly cartCount: Locator;
  private readonly footer: Locator;
  private readonly newsletterSignup: Locator;
  private readonly socialLinks: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.header = page.locator('.header__heading');
    this.navigation = page.locator('nav');
    this.searchInput = page.locator('input[type="search"], input[name="q"]');
    this.searchButton = page.locator('.search__button');
    this.productGrid = page.locator('.product-grid, .grid');
    this.productCards = page.locator('.grid__item');
    this.cartIcon = page.locator('.header__icon--cart, #cart-icon-bubble');
    this.cartCount = page.locator('.cart-count-bubble');
    this.footer = page.locator('footer');
    this.newsletterSignup = page.locator('.newsletter-signup, .email-signup');
    this.socialLinks = page.locator('.social-links, .social-media');
  }

  // Navigation methods
  async navigateToHome() {
    await this.goto('/');
  }

  async navigateToCollection(collectionName: string) {
    const collectionLink = this.page.locator(`a[href*="/collections/${collectionName}"]`);
    await this.clickElement(collectionLink);
  }

  async navigateToProduct(productHandle: string) {
    await this.goto(`/products/${productHandle}`);
  }

  // Search methods
  async searchForProduct(query: string) {
    await this.fillInput(this.searchInput, query);
    await this.clickElement(this.searchButton);
  }

  async getSearchResults() {
    return await this.productCards.all();
  }

  // Product methods
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async clickFirstProduct() {
    const firstProduct = this.productCards.first();
    await this.clickElement(firstProduct);
  }

  async addFirstProductToCart() {
    const addToCartButton = this.productCards.first().locator('.add-to-cart, [data-add-to-cart]');
    await this.clickElement(addToCartButton);
  }

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

  // Cart methods
  async getCartItemCount(): Promise<string> {
    return await this.getText(this.cartCount);
  }

  async openCart() {
    await this.clickElement(this.cartIcon);
  }

  // Newsletter methods
  async signUpForNewsletter(email: string) {
    const emailInput = this.newsletterSignup.locator('input[type="email"]');
    const submitButton = this.newsletterSignup.locator('button[type="submit"]');
    
    await this.fillInput(emailInput, email);
    await this.clickElement(submitButton);
  }

  // Social media methods
  async clickSocialLink(platform: string) {
    const socialLink = this.socialLinks.locator(`a[href*="${platform}"]`);
    await this.clickElement(socialLink);
  }

  // Validation methods
  async isHomePageLoaded(): Promise<boolean> {
    return await this.isVisible(this.header) && await this.isVisible(this.productGrid);
  }

  async hasProducts(): Promise<boolean> {
    const count = await this.getProductCount();
    return count > 0;
  }

  async isSearchWorking(): Promise<boolean> {
    return await this.isVisible(this.searchInput);
  }

  async isCartAccessible(): Promise<boolean> {
    return await this.isVisible(this.cartIcon);
  }

  // Utility methods
  async scrollToProducts() {
    await this.productGrid.scrollIntoViewIfNeeded();
  }

  async scrollToFooter() {
    await this.footer.scrollIntoViewIfNeeded();
  }

  async refreshPage() {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  // Додаю геттер для кнопки додати до кошика
  public getAddToCartButton() {
    return this.productCards.first().locator('.add-to-cart, [data-add-to-cart]');
  }

  public async openSearch() {
    await this.clickElement(this.searchInput);
  }
} 