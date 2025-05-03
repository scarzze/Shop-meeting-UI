export const categories = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    productCount: 8,
  },
  {
    id: 2,
    name: 'Fashion',
    slug: 'fashion',
    productCount: 6,
  },
  {
    id: 3,
    name: 'Home & Living',
    slug: 'home-living',
    productCount: 7,
  },
  {
    id: 4,
    name: 'Books',
    slug: 'books',
    productCount: 5,
  },
  {
    id: 5,
    name: 'Sports',
    slug: 'sports',
    productCount: 4,
  }
];

export const products = [
  {
    id: 1,
    name: 'MacBook Pro M2',
    price: 1299.99,
    description: 'Latest MacBook Pro with M2 chip, 13-inch Retina display, and up to 20 hours of battery life.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3',
    category: 'electronics',
    stock: 10,
    discountPercentage: 5,
    specifications: [
      { name: 'Processor', value: 'M2 chip' },
      { name: 'RAM', value: '8GB' },
      { name: 'Storage', value: '256GB SSD' }
    ]
  },
  {
    id: 2,
    name: 'Nike Air Max',
    price: 129.99,
    description: 'Classic Nike Air Max sneakers with comfortable cushioning and stylish design.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3',
    category: 'fashion',
    stock: 15,
    specifications: [
      { name: 'Material', value: 'Mesh and synthetic' },
      { name: 'Sole', value: 'Rubber' }
    ]
  },
  {
    id: 3,
    name: 'Modern Sofa',
    price: 899.99,
    description: 'Contemporary 3-seater sofa with premium fabric and elegant design.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3',
    category: 'home-living',
    stock: 5,
    discountPercentage: 10,
    specifications: [
      { name: 'Material', value: 'Premium fabric' },
      { name: 'Dimensions', value: '82" x 34" x 33"' }
    ]
  },
  {
    id: 4,
    name: 'Smart LED TV',
    price: 699.99,
    description: '55-inch 4K Ultra HD Smart LED TV with HDR and built-in streaming apps.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3',
    category: 'electronics',
    stock: 8,
    discountPercentage: 15,
    specifications: [
      { name: 'Screen Size', value: '55 inches' },
      { name: 'Resolution', value: '4K Ultra HD' }
    ]
  },
  {
    id: 5,
    name: 'Leather Jacket',
    price: 199.99,
    description: 'Classic leather jacket with premium quality material and comfortable fit.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3',
    category: 'fashion',
    stock: 12,
    specifications: [
      { name: 'Material', value: 'Genuine leather' },
      { name: 'Style', value: 'Biker jacket' }
    ]
  },
  {
    id: 6,
    name: 'Coffee Table',
    price: 149.99,
    description: 'Modern coffee table with wooden top and metal frame.',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3',
    category: 'home-living',
    stock: 7,
    specifications: [
      { name: 'Material', value: 'Wood and metal' },
      { name: 'Dimensions', value: '47" x 24" x 18"' }
    ]
  },
  {
    id: 7,
    name: 'Wireless Headphones',
    price: 199.99,
    description: 'Premium wireless headphones with active noise cancellation.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3',
    category: 'electronics',
    stock: 20,
    specifications: [
      { name: 'Battery Life', value: 'Up to 30 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.0' }
    ]
  },
  {
    id: 8,
    name: 'Running Shoes',
    price: 89.99,
    description: 'Comfortable running shoes with breathable mesh and cushioned sole.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3',
    category: 'sports',
    stock: 25,
    specifications: [
      { name: 'Material', value: 'Mesh' },
      { name: 'Type', value: 'Running' }
    ]
  }
];