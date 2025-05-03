import { products, categories } from '../utils/mockData';

// Mock API implementation
export const profileService = {
  // Profile endpoints
  getProfile: () => Promise.resolve({ data: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country'
  }}),
  updateProfile: (data) => Promise.resolve({ data }),
  uploadProfilePicture: (formData) => Promise.resolve({ data: { url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100' } }),

  // Authentication endpoints
  login: (credentials) => Promise.resolve({ data: {
    name: 'John Doe',
    email: credentials.email,
    token: 'mock_token_123'
  }}),
  register: (userData) => Promise.resolve({ data: {
    name: userData.name,
    email: userData.email,
    token: 'mock_token_123'
  }}),
  logout: () => Promise.resolve(),

  // Product related endpoints
  getProducts: () => Promise.resolve({ data: products }),
  getProduct: (id) => Promise.resolve({ data: products.find(p => p.id === parseInt(id)) }),
  getCategories: () => Promise.resolve({ data: categories }),
  
  // Order related endpoints
  getOrderHistory: () => Promise.resolve({ data: [
    {
      id: 1,
      date: '2025-05-01',
      status: 'delivered',
      items: [
        { id: 1, name: 'MacBook Pro M2', price: 1299.99, quantity: 1 },
        { id: 2, name: 'Nike Air Max', price: 129.99, quantity: 2 }
      ],
      total: 1559.97
    },
    {
      id: 2,
      date: '2025-04-28',
      status: 'processing',
      items: [
        { id: 3, name: 'Modern Sofa', price: 899.99, quantity: 1 }
      ],
      total: 899.99
    }
  ]})
};