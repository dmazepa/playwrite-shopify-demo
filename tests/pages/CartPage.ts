import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // Locators
  private readonly cartContainer: Locator;
  private readonly cartItems: Locator;
  private readonly cartItem: Locator;
  private readonly itemTitle: Locator;
  private readonly itemPrice: Locator;
  private readonly itemQuantity: Locator;
  private readonly itemRemoveButton: Locator;
  private readonly itemImage: Locator;
  private readonly subtotal: Locator;
  private readonly tax: Locator;
  private readonly shipping: Locator;
  private readonly total: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly emptyCartMessage: Locator;
  public readonly couponInput: Locator;
  private readonly applyCouponButton: Locator;
  private readonly couponCode: Locator;
  private readonly removeCouponButton: Locator;
  private readonly quantityIncreaseButton: Locator;
  private readonly quantityDecreaseButton: Locator;
  private readonly saveForLaterButton: Locator;
  private readonly savedItems: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.cartContainer = page.locator('.cart-container, .shopping-cart, [data-cart]');
    this.cartItems = page.locator('.cart-item, .cart-line-item, [data-cart-item]');
    this.cartItem = page.locator('.cart-item, .cart-line-item');
    this.itemTitle = page.locator('.item-title, .product-title, [data-item-title]');
    this.itemPrice = page.locator('.item-price, .product-price, [data-item-price]');
    this.itemQuantity = page.locator('.item-quantity, .quantity-input, [data-item-quantity]');
    this.itemRemoveButton = page.locator('.remove-item, .delete-item, [data-remove-item]');
    this.itemImage = page.locator('.item-image, .product-image, [data-item-image]');
    this.subtotal = page.locator('.subtotal, .cart-subtotal, [data-subtotal]');
    this.tax = page.locator('.tax, .cart-tax, [data-tax]');
    this.shipping = page.locator('.shipping, .cart-shipping, [data-shipping]');
    this.total = page.locator('.total, .cart-total, [data-total]');
    this.checkoutButton = page.locator('.checkout, .proceed-to-checkout, [data-checkout]');
    this.continueShoppingButton = page.locator('.continue-shopping, .keep-shopping, [data-continue-shopping]');
    this.emptyCartMessage = page.locator('.empty-cart, .cart-empty, [data-empty-cart]');
    this.couponInput = page.locator('.coupon-input, .discount-code, [data-coupon-input]');
    this.applyCouponButton = page.locator('.apply-coupon, .apply-discount, [data-apply-coupon]');
    this.couponCode = page.locator('.coupon-code, .applied-discount, [data-coupon-code]');
    this.removeCouponButton = page.locator('.remove-coupon, .remove-discount, [data-remove-coupon]');
    this.quantityIncreaseButton = page.locator('.quantity-plus, .qty-plus, [data-increase-quantity]');
    this.quantityDecreaseButton = page.locator('.quantity-minus, .qty-minus, [data-decrease-quantity]');
    this.saveForLaterButton = page.locator('.save-for-later, .wishlist, [data-save-for-later]');
    this.savedItems = page.locator('.saved-items, .wishlist-items, [data-saved-items]');
  }

  // Navigation methods
  async navigateToCart() {
    await this.goto('/cart');
  }

  async openCartDrawer() {
    const cartIcon = this.page.locator('.cart-icon, .shopping-cart, [data-cart-icon]');
    await this.clickElement(cartIcon);
  }

  // Cart item methods
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItemTitle(index: number): Promise<string> {
    const items = await this.cartItems.all();
    if (items[index]) {
      return await this.getText(items[index].locator('.item-title, .product-title'));
    }
    return '';
  }

  async getItemPrice(index: number): Promise<string> {
    const items = await this.cartItems.all();
    if (items[index]) {
      return await this.getText(items[index].locator('.item-price, .product-price'));
    }
    return '';
  }

  async getItemQuantity(index: number): Promise<number> {
    const items = await this.cartItems.all();
    if (items[index]) {
      const quantityInput = items[index].locator('.item-quantity, .quantity-input');
      const value = await quantityInput.inputValue();
      return parseInt(value) || 1;
    }
    return 0;
  }

  async setItemQuantity(index: number, quantity: number) {
    const items = await this.cartItems.all();
    if (items[index]) {
      const quantityInput = items[index].locator('.item-quantity, .quantity-input');
      await this.fillInput(quantityInput, quantity.toString());
    }
  }

  async increaseItemQuantity(index: number) {
    const items = await this.cartItems.all();
    if (items[index]) {
      const increaseButton = items[index].locator('.quantity-plus, .qty-plus');
      await this.clickElement(increaseButton);
    }
  }

  async decreaseItemQuantity(index: number) {
    const items = await this.cartItems.all();
    if (items[index]) {
      const decreaseButton = items[index].locator('.quantity-minus, .qty-minus');
      await this.clickElement(decreaseButton);
    }
  }

  async removeItem(index: number) {
    const items = await this.cartItems.all();
    if (items[index]) {
      const removeButton = items[index].locator('.remove-item, .delete-item');
      await this.clickElement(removeButton);
    }
  }

  async saveItemForLater(index: number) {
    const items = await this.cartItems.all();
    if (items[index]) {
      const saveButton = items[index].locator('.save-for-later, .wishlist');
      await this.clickElement(saveButton);
    }
  }

  // Price methods
  async getSubtotal(): Promise<string> {
    return await this.getText(this.subtotal);
  }

  async getTax(): Promise<string> {
    return await this.getText(this.tax);
  }

  async getShipping(): Promise<string> {
    return await this.getText(this.shipping);
  }

  async getTotal(): Promise<string> {
    return await this.getText(this.total);
  }

  // Coupon methods
  async applyCoupon(couponCode: string) {
    await this.fillInput(this.couponInput, couponCode);
    await this.clickElement(this.applyCouponButton);
  }

  async removeCoupon() {
    await this.clickElement(this.removeCouponButton);
  }

  async getAppliedCoupon(): Promise<string> {
    return await this.getText(this.couponCode);
  }

  async isCouponApplied(): Promise<boolean> {
    return await this.isVisible(this.couponCode);
  }

  // Action methods
  async proceedToCheckout() {
    await this.clickElement(this.checkoutButton);
  }

  async continueShopping() {
    await this.clickElement(this.continueShoppingButton);
  }

  async clearCart() {
    const removeButtons = await this.itemRemoveButton.all();
    for (const button of removeButtons) {
      await this.clickElement(button);
      await this.page.waitForTimeout(500); // Wait for item removal
    }
  }

  // Validation methods
  async isCartEmpty(): Promise<boolean> {
    return await this.isVisible(this.emptyCartMessage);
  }

  async isCartLoaded(): Promise<boolean> {
    return await this.isVisible(this.cartContainer);
  }

  async hasItems(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count > 0;
  }

  async canCheckout(): Promise<boolean> {
    return await this.isVisible(this.checkoutButton);
  }

  // Utility methods
  async waitForCartUpdate() {
    await this.page.waitForTimeout(1000); // Wait for cart to update
  }

  async refreshCart() {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async scrollToCartItems() {
    await this.cartItems.first().scrollIntoViewIfNeeded();
  }

  async scrollToCheckout() {
    await this.checkoutButton.scrollIntoViewIfNeeded();
  }

  // Cart drawer methods (for mobile/mini cart)
  async isCartDrawerOpen(): Promise<boolean> {
    const drawer = this.page.locator('.cart-drawer, .mini-cart, [data-cart-drawer]');
    return await this.isVisible(drawer);
  }

  async closeCartDrawer() {
    const closeButton = this.page.locator('.cart-drawer-close, .mini-cart-close, [data-close-cart]');
    await this.clickElement(closeButton);
  }

  // Saved items methods
  async getSavedItemsCount(): Promise<number> {
    return await this.savedItems.count();
  }

  async moveSavedItemToCart(index: number) {
    const savedItems = await this.savedItems.all();
    if (savedItems[index]) {
      const moveToCartButton = savedItems[index].locator('.move-to-cart, .add-to-cart');
      await this.clickElement(moveToCartButton);
    }
  }

  public get quantityInputs() {
    return this.cartItems.locator('.item-quantity, .quantity-input');
  }

  public async isEmpty(): Promise<boolean> {
    return await this.isCartEmpty();
  }

  public async updateQuantity(index: number, quantity: number) {
    await this.setItemQuantity(index, quantity);
  }

  public async removeFirstItem() {
    await this.removeItem(0);
  }

  public getCheckoutButton() {
    return this.checkoutButton;
  }
} 