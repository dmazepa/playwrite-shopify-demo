import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // Locators
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  private readonly productDescription: Locator;
  public readonly productImages: Locator;
  public readonly mainImage: Locator;
  private readonly thumbnailImages: Locator;
  public readonly variantSelectors: Locator;
  private readonly sizeSelector: Locator;
  private readonly colorSelector: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly buyNowButton: Locator;
  private readonly wishlistButton: Locator;
  private readonly shareButton: Locator;
  private readonly breadcrumbs: Locator;
  private readonly relatedProducts: Locator;
  private readonly reviews: Locator;
  private readonly stockStatus: Locator;
  private readonly sku: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.productTitle = page.locator('.product-title, h1, [data-product-title]');
    this.productPrice = page.locator('.product-price, .price, [data-product-price]');
    this.productDescription = page.locator('.product-description, .description, [data-product-description]');
    this.productImages = page.locator('.product-images, .product-gallery');
    this.mainImage = page.locator('.main-image, .product-image img');
    this.thumbnailImages = page.locator('.thumbnail, .product-thumbnail');
    this.variantSelectors = page.locator('.variant-selector, .product-option');
    this.sizeSelector = page.locator('select[name*="size"], input[name*="size"]');
    this.colorSelector = page.locator('select[name*="color"], input[name*="color"]');
    this.quantityInput = page.locator('input[name="quantity"], .quantity-input');
    this.addToCartButton = page.locator('.add-to-cart, [data-add-to-cart]');
    this.buyNowButton = page.locator('.buy-now, [data-buy-now]');
    this.wishlistButton = page.locator('.wishlist, .favorite, [data-wishlist]');
    this.shareButton = page.locator('.share, [data-share]');
    this.breadcrumbs = page.locator('.breadcrumbs, .breadcrumb');
    this.relatedProducts = page.locator('.related-products, .recommendations');
    this.reviews = page.locator('.reviews, .product-reviews');
    this.stockStatus = page.locator('.stock-status, .availability');
    this.sku = page.locator('.sku, [data-sku]');
  }

  // Product information methods
  async getProductTitle(): Promise<string> {
    return await this.getText(this.productTitle);
  }

  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescription);
  }

  async getSKU(): Promise<string> {
    return await this.getText(this.sku);
  }

  async getStockStatus(): Promise<string> {
    return await this.getText(this.stockStatus);
  }

  // Image methods
  async getMainImageSrc(): Promise<string> {
    return await this.mainImage.getAttribute('src') || '';
  }

  async clickThumbnail(index: number) {
    const thumbnails = await this.thumbnailImages.all();
    if (thumbnails[index]) {
      await this.clickElement(thumbnails[index]);
    }
  }

  async getImageCount(): Promise<number> {
    return await this.thumbnailImages.count();
  }

  // Variant methods
  async selectSize(size: string) {
    await this.sizeSelector.selectOption(size);
  }

  async selectColor(color: string) {
    await this.colorSelector.selectOption(color);
  }

  async getAvailableVariants(): Promise<string[]> {
    const options = this.sizeSelector.locator('option');
    const optionElements = await options.all();
    return (await Promise.all(optionElements.map(el => el.textContent()))).filter(Boolean) as string[];
  }

  // Quantity methods
  async setQuantity(quantity: number) {
    await this.fillInput(this.quantityInput, quantity.toString());
  }

  async increaseQuantity() {
    const increaseButton = this.page.locator('.quantity-plus, .qty-plus');
    await this.clickElement(increaseButton);
  }

  async decreaseQuantity() {
    const decreaseButton = this.page.locator('.quantity-minus, .qty-minus');
    await this.clickElement(decreaseButton);
  }

  async getCurrentQuantity(): Promise<number> {
    const value = await this.quantityInput.inputValue();
    return parseInt(value) || 1;
  }

  // Action methods
  async addToCart() {
    await this.clickElement(this.addToCartButton);
  }

  async buyNow() {
    await this.clickElement(this.buyNowButton);
  }

  async addToWishlist() {
    await this.clickElement(this.wishlistButton);
  }

  async shareProduct() {
    await this.clickElement(this.shareButton);
  }

  // Navigation methods
  async navigateToRelatedProduct(index: number) {
    const relatedProductLinks = this.relatedProducts.locator('a');
    const links = await relatedProductLinks.all();
    if (links[index]) {
      await this.clickElement(links[index]);
    }
  }

  async goBackToCollection() {
    const collectionLink = this.breadcrumbs.locator('a').last();
    await this.clickElement(collectionLink);
  }

  // Review methods
  async getReviewCount(): Promise<number> {
    const reviewItems = this.reviews.locator('.review-item, .review');
    return await reviewItems.count();
  }

  async writeReview(rating: number, comment: string) {
    const ratingStars = this.reviews.locator(`.rating-star:nth-child(${rating})`);
    const commentInput = this.reviews.locator('textarea[name="comment"]');
    const submitButton = this.reviews.locator('button[type="submit"]');

    await this.clickElement(ratingStars);
    await this.fillInput(commentInput, comment);
    await this.clickElement(submitButton);
  }

  // Validation methods
  async isProductPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.productTitle) && await this.isVisible(this.addToCartButton);
  }

  async isProductInStock(): Promise<boolean> {
    const status = await this.getStockStatus();
    return !status.toLowerCase().includes('out of stock') && !status.toLowerCase().includes('unavailable');
  }

  async hasVariants(): Promise<boolean> {
    return await this.isVisible(this.variantSelectors);
  }

  async hasImages(): Promise<boolean> {
    return await this.isVisible(this.productImages);
  }

  async hasReviews(): Promise<boolean> {
    return await this.isVisible(this.reviews);
  }

  // Utility methods
  async scrollToProductInfo() {
    await this.productTitle.scrollIntoViewIfNeeded();
  }

  async scrollToReviews() {
    await this.reviews.scrollIntoViewIfNeeded();
  }

  async scrollToRelatedProducts() {
    await this.relatedProducts.scrollIntoViewIfNeeded();
  }

  async waitForAddToCartSuccess() {
    await this.page.waitForSelector('.add-to-cart-success, .cart-notification', { timeout: 5000 });
  }

  public async isAddToCartEnabled(): Promise<boolean> {
    return await this.addToCartButton.isEnabled();
  }
} 