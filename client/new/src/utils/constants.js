export const API_BASE_URL = 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  CART_ITEMS: 'cart_items',
  USER_PREFERENCES: 'user_preferences',
  APPLIED_DISCOUNT: 'applied_discount',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
};

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 12,
  INITIAL_PAGE: 1,
};

export const imageDefaults = {
  PLACEHOLDER_IMAGE: 'https://via.placeholder.com/300',
  AVATAR_PLACEHOLDER: 'https://via.placeholder.com/150',
};

export const routes = {
  HOME: '/',
  PROFILE: '/profile',
  PRODUCT: '/product/:id',
  CATEGORY: '/category/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
};