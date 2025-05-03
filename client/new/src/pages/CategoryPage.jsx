import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FaSort, FaFilter } from 'react-icons/fa';
import { profileService } from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await profileService.getProducts();
        let filteredProducts = response.data;

        // Filter by category
        if (slug) {
          filteredProducts = filteredProducts.filter(
            product => product.category === slug
          );
        }

        // Apply price filter
        if (priceRange.min) {
          filteredProducts = filteredProducts.filter(
            product => product.price >= Number(priceRange.min)
          );
        }
        if (priceRange.max) {
          filteredProducts = filteredProducts.filter(
            product => product.price <= Number(priceRange.max)
          );
        }

        // Apply sorting
        filteredProducts = sortProducts(filteredProducts, sortOption);

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, sortOption, priceRange.min, priceRange.max]);

  const sortProducts = (products, option) => {
    switch (option) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default: // 'featured'
        return products;
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    searchParams.set('sort', option);
    setSearchParams(searchParams);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
    if (value) {
      searchParams.set(`${type}Price`, value);
    } else {
      searchParams.delete(`${type}Price`);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with categories and filters */}
        <aside className="md:w-64 flex-shrink-0 space-y-6">
          <CategoryList />
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden text-gray-600"
              >
                <FaFilter />
              </button>
            </div>

            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold capitalize">
              {slug ? slug.replace('-', ' ') : 'All Products'}
            </h2>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">
                No products found in this category
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your filters or browse our other categories
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;