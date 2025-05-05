import React from 'react';
import { FaStar, FaRegHeart, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { FiTruck, FiRefreshCw, FiHeadphones, FiShield } from 'react-icons/fi';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import FlashSalesTimer from '../components/FlashSalesTimer';

const Home = () => {
  // Set deadline for flash sale - 3 days from now
  const flashSaleDeadline = new Date();
  flashSaleDeadline.setDate(flashSaleDeadline.getDate() + 3);

  const flashSales = [
    {
      title: 'HAVIT HV-G92 Gamepad',
      price: 1200,
      oldPrice: 1600,
      img: '/images/HAVIT HV-G92 Gamepad.jpg',
      rating: 4.5,
      reviews: 88,
      discount: '-25%'
    },
    {
      title: 'AK-900 Wired Keyboard',
      price: 960,
      oldPrice: 1160,
      img: '/images/AK-900 Wired Keyboard.jpg',
      rating: 4.0,
      reviews: 75,
      discount: '-35%'
    },
    {
      title: 'IPS LCD Gaming Monitor',
      price: 28000,
      oldPrice: 34000,
      img: '/images/IPS LCD Gaming Monitor.jpg',
      rating: 4.7,
      reviews: 99,
      discount: '-30%'
    },
    {
      title: 'S-Series Comfort Chair',
      price: 3750,
      oldPrice: 5000,
      img: '/images/S-Series Comfort Chair.jpg',
      rating: 4.3,
      reviews: 99,
      discount: '-25%'
    },
  ];

  const bestSelling = [
    {
      title: 'The north coat',
      price: 2600,
      oldPrice: 3600,
      img: '/images/The north coat.jpg',
      rating: 5,
      reviews: 65
    },
    {
      title: 'Gucci duffle bag',
      price: 9600,
      oldPrice: 11600,
      img: '/images/Gucci duffle bag.jpg',
      rating: 4.5,
      reviews: 65
    },
    {
      title: 'RGB liquid CPU Cooler',
      price: 1600,
      oldPrice: 1700,
      img: '/images/RGB liquid CPU Cooler.jpg',
      rating: 4.5,
      reviews: 65
    },
    {
      title: 'Small BookShelf',
      price: 3600,
      oldPrice: null,
      img: '/images/Small BookShelf.jpg',
      rating: 5,
      reviews: 65
    },
  ];

  const exploreProducts = [
    {
      title: 'Breed Dry Dog Food',
      price: 1000,
      img: '/images/Breed Dry Dog Food.jpg',
      rating: 3,
      reviews: 35
    },
    {
      title: 'CANON EOS DSLR Camera',
      price: 3600,
      img: '/images/CANON EOS DSLR Camera.jpg',
      rating: 4,
      reviews: 95,
      button: 'Add To Cart'
    },
    {
      title: 'ASUS F10 Gaming Laptop',
      price: 7000,
      img: '/images/ASUS F10 Gaming Laptop.jpg',
      rating: 5,
      reviews: 325
    },
    {
      title: 'Curology Product Set',
      price: 5000,
      img: '/images/Curology Product Set.avif',
      rating: 4,
      reviews: 145
    },
    {
      title: 'Kids Electric Car',
      price: 9600,
      img: '/images/Kids Electric Car.webp',
      rating: 5,
      reviews: 65,
      tag: 'New'
    },
    {
      title: 'Jr. Zoom Soccer Cleats',
      price: 11600,
      img: '/images/Jr. Zoom Soccer Cleats.jpg',
      rating: 4.5,
      reviews: 35,
      tag: 'New'
    },
    {
      title: 'GP11 Shooter USB Gamepad',
      price: 6600,
      img: '/images/GP11 Shooter USB Gamepad.jpg',
      rating: 4.5,
      reviews: 55
    },
    {
      title: 'Quilted Satin Jacket',
      price: 6600,
      img: '/images/Quilted Satin Jacket.jpg',
      rating: 4.5,
      reviews: 55
    },
  ];

  const categories = [
    "Women's Fashion", "Men's Fashion", "Electronics", "Home & Lifestyle", "Medicine",
    "Sports & Outdoor", "Baby's & Toys", "Groceries & Pets", "Health & Beauty"
  ];

  const featureCards = [
    { icon: <FiTruck />, title: 'FREE AND FAST DELIVERY', desc: 'Free delivery for all orders over KES140' },
    { icon: <FiHeadphones />, title: '24/7 CUSTOMER SERVICE', desc: 'Friendly 24/7 customer support' },
    { icon: <FiShield />, title: 'MONEY BACK GUARANTEE', desc: 'We return money within 30 days' },
  ];

  const categoryIcons = [
    { label: 'Phones', icon: '/images/cat-phone.png' },
    { label: 'Computers', icon: '/images/cat-computer.png' },
    { label: 'SmartWatch', icon: '/images/cat-watch.png' },
    { label: 'Camera', icon: '/images/cat-camera.png' },
    { label: 'HeadPhones', icon: '/images/cat-headphones.png' },
    { label: 'Gaming', icon: '/images/cat-gaming.png' },
  ];

  const newArrivals = [
    {
      title: 'PlayStation 5',
      description: 'Black and White version of the PS5 coming out on sale.',
      image: '/images/PS5.avif',
      link: 'Shop Now'
    },
    {
      title: "Women's Collections",
      description: 'Featured woman collections that give you another vibe.',
      image: '/images/women-collection.jpg',
      link: 'Shop Now'
    },
    {
      title: 'Speakers',
      description: 'Amazon wireless speakers',
      image: '/images/speakers.jpg',
      link: 'Shop Now'
    },
    {
      title: 'Perfume',
      description: 'GUCCI INTENSE OUD EDP',
      image: '/images/perfume.jpg',
      link: 'Shop Now'
    },
  ];

  // Audio promotion section
  const audioPromotion = {
    title: 'Enhance Your Music Experience',
    image: '/images/JBL.png',
    deadline: flashSaleDeadline
  };

  return (
    <div className="px-4 md:px-12 lg:px-24">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <ul className="hidden md:flex flex-col text-sm font-medium text-gray-700 space-y-4">
          {categories.map(cat => (
            <li key={cat} className="hover:text-red-500 cursor-pointer flex justify-between items-center">
              {cat}
              {cat.includes('Fashion') && <span className="text-gray-400">›</span>}
            </li>
          ))}
        </ul>
        <div className="md:col-span-3">
          <Carousel 
            autoPlay 
            infiniteLoop 
            showThumbs={false} 
            showStatus={false}
            showIndicators={true}
            className="rounded-lg overflow-hidden"
          >
            <div>
              <img src="/images/iphoneke.jpg" alt="iPhone 14 banner" className="w-full h-126 object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center px-12">
                <h2 className="text-4xl font-bold text-white mb-4">Up to 10% off Voucher</h2>
                <button className="bg-black text-white px-6 py-2 rounded w-32 flex items-center">
                  Shop Now <HiOutlineArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            <div><img src="/images/levitan.jpg" alt="banner"  className="w-full h-126 object-cover"/></div>
          </Carousel>
        </div>
      </div>

      {/* Flash Sales Section */}
      <section className="mt-16">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center">
            <div className="w-5 h-10 bg-red-500 rounded mr-3"></div>
            <h2 className="text-xl font-bold">Today's</h2>
          </div>
          <div className="flex items-center">
            <h3 className="text-xl font-bold mr-6">Flash Sales</h3>
            <FlashSalesTimer deadline={flashSaleDeadline.toString()} />
          </div>
          <div className="flex">
            <button className="p-2 border rounded-full mr-2 hover:bg-gray-100">
              <HiOutlineArrowLeft className="text-lg" />
            </button>
            <button className="p-2 border rounded-full hover:bg-gray-100">
              <HiOutlineArrowRight className="text-lg" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {flashSales.map((product, i) => (
            <div key={i} className="border p-4 rounded-lg relative group">
              <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 absolute top-3 left-3 rounded">
                {product.discount}
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <FaRegHeart className="text-lg" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <FaEye className="text-lg" />
                </button>
              </div>
              <div className="h-48 w-full flex justify-center items-center mb-4">
                <img src={product.img} alt={product.title} className="h-full object-contain" />
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-base mb-2">{product.title}</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-red-500 font-semibold">KES{product.price}</span>
                  <span className="line-through text-gray-400 text-sm">KES{product.oldPrice}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {Array(5).fill().map((_, i) => (
                      <FaStar key={i} size={14} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews})</span>
                </div>
                <button className="bg-black text-white py-2 w-full text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="border px-8 py-2 text-sm rounded text-red-500 border-red-500 hover:bg-red-500 hover:text-white font-medium">
            View All Products
          </button>
        </div>
      </section>

      {/* Browse By Category Section */}
      <section className="mt-16">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center">
            <div className="w-5 h-10 bg-red-500 rounded mr-3"></div>
            <h2 className="text-xl font-bold">Categories</h2>
          </div>
          <h3 className="text-xl font-bold">Browse By Category</h3>
          <div className="flex">
            <button className="p-2 border rounded-full mr-2 hover:bg-gray-100">
              <HiOutlineArrowLeft className="text-lg" />
            </button>
            <button className="p-2 border rounded-full hover:bg-gray-100">
              <HiOutlineArrowRight className="text-lg" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-6">
          {categoryIcons.map((cat, i) => (
            <div key={i} className="flex flex-col items-center justify-center border py-6 rounded-lg hover:border-red-500 cursor-pointer hover:bg-gray-50 transition-all">
              <div className="h-12 w-12 flex items-center justify-center">
                <img src={cat.icon} alt={cat.label} className="h-full object-contain" />
              </div>
              <span className="text-sm mt-3">{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Promotion Banner */}
      <section className="mt-16 bg-black text-white rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="text-green-500 font-medium mb-2">Categories</div>
            <h2 className="text-3xl font-bold mb-8">{audioPromotion.title}</h2>
            <div className="flex gap-4 mb-8">
              <div className="bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center text-black">
                <span className="font-bold">23</span>
                <span className="text-xs">Hours</span>
              </div>
              <div className="bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center text-black">
                <span className="font-bold">05</span>
                <span className="text-xs">Days</span>
              </div>
              <div className="bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center text-black">
                <span className="font-bold">59</span>
                <span className="text-xs">Minutes</span>
              </div>
              <div className="bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center text-black">
                <span className="font-bold">35</span>
                <span className="text-xs">Seconds</span>
              </div>
            </div>
            <button className="bg-green-500 text-white px-6 py-2 rounded">
              Buy Now!
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src={audioPromotion.image} alt="JBL Speaker" className="h-64 w-200 object-contain " />
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="mt-16">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center">
            <div className="w-5 h-10 bg-red-500 rounded mr-3"></div>
            <h2 className="text-xl font-bold">This Month</h2>
          </div>
          <h3 className="text-xl font-bold">Best Selling Products</h3>
          <button className="bg-red-500 text-white px-6 py-2 rounded">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {bestSelling.map((product, i) => (
            <div key={i} className="border p-4 rounded-lg relative group">
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <FaRegHeart className="text-lg" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <FaEye className="text-lg" />
                </button>
              </div>
              <div className="h-48 w-full flex justify-center items-center mb-4">
                <img src={product.img} alt={product.title} className="h-full object-contain" />
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-base mb-2">{product.title}</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-red-500 font-semibold">KES{product.price}</span>
                  {product.oldPrice && <span className="line-through text-gray-400 text-sm">KES{product.oldPrice}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {Array(5).fill().map((_, i) => (
                      <FaStar key={i} size={14} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Our Products */}
      <section className="mt-16">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center">
            <div className="w-5 h-10 bg-red-500 rounded mr-3"></div>
            <h2 className="text-xl font-bold">Our Products</h2>
          </div>
          <h3 className="text-xl font-bold">Explore Our Products</h3>
          <div className="flex">
            <button className="p-2 border rounded-full mr-2 hover:bg-gray-100">
              <HiOutlineArrowLeft className="text-lg" />
            </button>
            <button className="p-2 border rounded-full hover:bg-gray-100">
              <HiOutlineArrowRight className="text-lg" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {exploreProducts.slice(0, 8).map((product, i) => (
            <div key={i} className="border p-4 rounded-lg relative group">
              {product.tag && (
                <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 absolute top-3 left-3 rounded">
                  {product.tag}
                </div>
              )}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <FaRegHeart className="text-lg" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                  <FaEye className="text-lg" />
                </button>
              </div>
              <div className="h-48 w-full flex justify-center items-center mb-4">
                <img src={product.img} alt={product.title} className="h-full object-contain" />
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-base mb-2">{product.title}</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-red-500 font-semibold">KES{product.price}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {Array(5).fill().map((_, i) => (
                      <FaStar key={i} size={14} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews})</span>
                </div>
                {product.button && (
                  <button className="bg-black text-white py-2 w-full text-sm rounded">
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-red-500 text-white px-8 py-2 rounded">
            View All Products
          </button>
        </div>
      </section>

      {/* New Arrival Section */}
      <section className="mt-16">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center">
            <div className="w-5 h-10 bg-red-500 rounded mr-3"></div>
            <h2 className="text-xl font-bold">Featured</h2>
          </div>
          <h3 className="text-xl font-bold">New Arrival</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-black text-white rounded-lg overflow-hidden h-96 relative">
            <img src={newArrivals[0].image} alt={newArrivals[0].title} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold mb-2">{newArrivals[0].title}</h3>
              <p className="mb-4 text-sm">{newArrivals[0].description}</p>
              <button className="bg-transparent border border-white text-white px-4 py-1 rounded w-32">
                {newArrivals[0].link}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black text-white rounded-lg overflow-hidden h-44 relative">
              <img src={newArrivals[1].image} alt={newArrivals[1].title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-xl font-bold mb-1">{newArrivals[1].title}</h3>
                <p className="mb-2 text-xs">{newArrivals[1].description}</p>
                <button className="bg-transparent border border-white text-white px-3 py-1 rounded text-xs">
                  {newArrivals[1].link}
                </button>
              </div>
            </div>
            <div className="bg-black text-white rounded-lg overflow-hidden h-44 relative">
              <img src={newArrivals[2].image} alt={newArrivals[2].title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-xl font-bold mb-1">{newArrivals[2].title}</h3>
                <p className="mb-2 text-xs">{newArrivals[2].description}</p>
                <button className="bg-transparent border border-white text-white px-3 py-1 rounded text-xs">
                  {newArrivals[2].link}
                </button>
              </div>
            </div>
            <div className="bg-black text-white rounded-lg overflow-hidden h-44 relative md:col-span-2">
              <img src={newArrivals[3].image} alt={newArrivals[3].title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-xl font-bold mb-1">{newArrivals[3].title}</h3>
                <p className="mb-2 text-xs">{newArrivals[3].description}</p>
                <button className="bg-transparent border border-white text-white px-3 py-1 rounded text-xs">
                  {newArrivals[3].link}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mt-16 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {featureCards.map((card, i) => (
          <div key={i} className="flex flex-col items-center p-6 border rounded-lg shadow-sm">
            <div className="text-3xl text-black mb-4 bg-gray-100 p-4 rounded-full">{card.icon}</div>
            <h4 className="font-bold mb-2 text-sm">{card.title}</h4>
            <p className="text-xs text-gray-500">{card.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;