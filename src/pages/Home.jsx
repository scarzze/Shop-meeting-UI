import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FlashSalesTimer from '../components/FlashSalesTimer';
import CategoryCard from '../components/CategoryCard';

const Home = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [exploreProducts, setExploreProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      try {
        const [flash, cats, best, explore, newProd] = await Promise.all([
          axios.get(`${base}/products/flash-sales`),
          axios.get(`${base}/categories`),
          axios.get(`${base}/products/best-sellers`),
          axios.get(`${base}/products/explore`),
          axios.get(`${base}/products/new-arrivals`)
        ]);
        setFlashSales(flash.data);
        setCategories(cats.data);
        setBestSellers(best.data);
        setExploreProducts(explore.data);
        setNewArrivals(newProd.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    };
    fetchData();
  }, []);

  return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Flash Sales Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Flash Sales</h2>
            <FlashSalesTimer deadline="2025-05-10T00:00:00" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {flashSales.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="bg-red-500 text-white px-6 py-2 rounded-md">View All Products</button>
          </div>
        </section>

        {/* Category Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Browse By Category</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mb-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Best Selling Products</h2>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Explore Products */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Explore Our Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exploreProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrival */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">New Arrival</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
  );
};

export default Home;
