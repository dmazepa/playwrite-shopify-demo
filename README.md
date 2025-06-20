# 🛍️ Shopify Ecommerce Test Suite

Повний набір автоматизованих тестів для Shopify Ecommerce магазину з використанням Playwright та Page Object Model.

## 🚀 Швидкий старт

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Запуск тестів

```bash
# Запустити всі тести
npm test

# Запустити конкретний тест
npx playwright test tests/auth.spec.ts

# Запустити тести з UI
npx playwright test --ui

# Запустити тести в headed режимі
npx playwright test --headed
```

## 📁 Структура проекту

```
playwrite-shopify-demo/
├── tests/
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.ts          # Базовий клас
│   │   ├── HomePage.ts          # Головна сторінка
│   │   ├── ProductPage.ts       # Сторінка продукту
│   │   ├── CartPage.ts          # Кошик
│   │   ├── SearchPage.ts        # Пошук
│   │   └── CategoryPage.ts      # Категорії
│   ├── homepage.spec.ts         # Тести головної сторінки
│   ├── product.spec.ts          # Тести продуктів
│   ├── cart.spec.ts             # Тести кошика
│   ├── search.spec.ts           # Тести пошуку
│   ├── category.spec.ts         # Тести категорій
│   ├── e2e-purchase.spec.ts     # End-to-end тести покупки
│   └── all-tests.spec.ts        # Всі тести разом
├── playwright.config.ts         # Конфігурація Playwright
└── README.md                    # Цей файл
```

## 🔐 Авторизація

Система автоматично авторизується в магазині перед запуском тестів:

- **URL**: https://01pxnh-tj.myshopify.com/password
- **Пароль**: dimamazepa
- **Процес**: Global setup автоматично входить в магазин та зберігає стан авторизації

## 🧪 Типи тестів

### 1. Авторизація (`auth.spec.ts`)
- Перевірка доступу до магазину
- Доступ до колекцій та продуктів
- Валідація авторизації

### 2. Головна сторінка (`homepage.spec.ts`)
- Завантаження сторінки
- Відображення продуктів
- Навігація по сайту
- Пошук та кошик
- Адаптивний дизайн

### 3. Продукти (`product.spec.ts`)
- Деталі продукту
- Галерея зображень
- Варіанти продукту (розмір, колір)
- Зміна кількості
- Додавання в кошик
- Функція "Купити зараз"
- Відгуки та пов'язані продукти

### 4. Кошик (`cart.spec.ts`)
- Відображення порожнього кошика
- Додавання продуктів
- Оновлення кількості
- Видалення продуктів
- Розрахунок загальної суми
- Застосування купонів
- Перехід до оформлення

### 5. Пошук (`search.spec.ts`)
- Базовий пошук
- Відображення результатів
- Пошук без результатів
- Фільтри та сортування
- Пагінація
- Підказки пошуку

### 6. Категорії (`category.spec.ts`)
- Навігація по категоріях
- Відображення продуктів
- Фільтри та сортування
- Підкатегорії
- Пагінація
- Мобільні фільтри

### 7. End-to-End покупка (`e2e-purchase.spec.ts`)
- Повний процес покупки
- Множинні продукти
- Варіанти продуктів
- Модифікація кошика
- Товари відсутні на складі
- Функція "Купити зараз"
- Збереження кошика

### 8. Всі тести (`all-tests.spec.ts`)
- Комплексний тест всіх функцій
- Тести авторизації та доступу
- Навігація та UX
- Адаптивний дизайн
- Продуктивність
- Обробка помилок
- Кросс-браузерна сумісність

## 🎯 Page Object Model

### BasePage
Базовий клас з загальними методами:
- `goto()` - навігація
- `waitForPageLoad()` - очікування завантаження
- `clickElement()` - клік по елементу
- `fillInput()` - заповнення поля
- `getText()` - отримання тексту
- `isVisible()` - перевірка видимості

### HomePage
Методи для роботи з головною сторінкою:
- `navigateToHome()` - перехід на головну
- `getProductCount()` - кількість продуктів
- `clickFirstProduct()` - клік по першому продукту
- `addFirstProductToCart()` - додавання в кошик
- `searchForProduct()` - пошук продукту

### ProductPage
Методи для роботи з продуктами:
- `getProductTitle()` - назва продукту
- `getProductPrice()` - ціна продукту
- `selectVariant()` - вибір варіанту
- `setQuantity()` - встановлення кількості
- `addToCart()` - додавання в кошик
- `buyNow()` - купити зараз

### CartPage
Методи для роботи з кошиком:
- `getCartItemCount()` - кількість товарів
- `updateQuantity()` - оновлення кількості
- `removeItem()` - видалення товару
- `proceedToCheckout()` - оформлення замовлення
- `applyCoupon()` - застосування купону

### SearchPage
Методи для роботи з пошуком:
- `searchForProduct()` - пошук продукту
- `getSearchResults()` - результати пошуку
- `applyFilter()` - застосування фільтра
- `sortBy()` - сортування результатів

### CategoryPage
Методи для роботи з категоріями:
- `navigateToCategory()` - перехід до категорії
- `getProductCount()` - кількість продуктів
- `applyFilter()` - застосування фільтра
- `sortBy()` - сортування продуктів

## 🧪 Запуск специфічних тестів

```bash
# Тільки тести авторизації
npx playwright test tests/auth.spec.ts

# Тільки тести головної сторінки
npx playwright test tests/homepage.spec.ts

# Тільки тести продуктів
npx playwright test tests/product.spec.ts

# Тільки тести кошика
npx playwright test tests/cart.spec.ts

# Тільки тести пошуку
npx playwright test tests/search.spec.ts

# Тільки тести категорій
npx playwright test tests/category.spec.ts

# Тільки end-to-end тести
npx playwright test tests/e2e-purchase.spec.ts

# Всі тести разом
npx playwright test tests/all-tests.spec.ts
```

## 📊 Звіти та результати

### HTML звіт
```bash
npx playwright test --reporter=html
npx playwright show-report
```

### JSON звіт
```bash
npx playwright test --reporter=json
```

### Screenshots
Тести автоматично створюють скріншоти при помилках в папці `test-results/`.

## 🔧 Налаштування середовища

### Браузери
Тести налаштовані для роботи з:
- Chromium (за замовчуванням)
- Firefox
- WebKit

### Конфігурація
- **Base URL**: https://01pxnh-tj.myshopify.com/
- **Timeout**: 30 секунд на тест
- **Retries**: 2 спроби на CI
- **Workers**: 1 на CI, паралельно локально

## 🐛 Відладка

### Запуск з відладкою
```bash
npx playwright test --debug
```

### Запуск з повільним режимом
```bash
npx playwright test --headed --slowmo=1000
```

### Перегляд трасування
```bash
npx playwright show-trace trace.zip
```

## 📝 Додавання нових тестів

1. Створіть новий Page Object в папці `tests/pages/`
2. Наслідуйте від `BasePage`
3. Додайте локатори та методи
4. Створіть тест файл в папці `tests/`
5. Використовуйте Page Object в тестах

## 🤝 Внесок

1. Форк проекту
2. Створіть feature branch
3. Додайте тести
4. Запустіть тести
5. Створіть Pull Request

## 📄 Ліцензія

MIT License

## 🆘 Підтримка

Для питань та підтримки звертайтеся до команди розробки.

## 🎉 Результати

Після успішного запуску всіх тестів ви побачите:

```
✅ Authentication and Access Test PASSED!
✅ Navigation and UX Test PASSED!
✅ Responsive Design Test PASSED!
✅ Performance and Loading Test PASSED!
✅ Error Handling and Edge Cases Test PASSED!
✅ Cross-Browser Compatibility Test PASSED!
🎉 Complete Ecommerce Flow Test PASSED!
```

Всі тести покривають основні функції Shopify Ecommerce магазину та забезпечують якість користувацького досвіду.
