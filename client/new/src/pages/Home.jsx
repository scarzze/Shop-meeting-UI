import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { profileService } from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await profileService.getProducts();
        let filteredProducts = response.data;

        // Filter by category if specified
        if (categorySlug) {
          filteredProducts = filteredProducts.filter(
            product => product.category === categorySlug
          );
        }

        // Filter by search query if specified
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(
            product =>
              product.name.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query)
          );
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categorySlug]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with categories */}
        <aside className="md:w-64 flex-shrink-0">
          <CategoryList />
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {searchQuery && (
            <h2 className="text-2xl font-bold mb-6">
              Search results for "{searchQuery}"
            </h2>
          )}
          {categorySlug && !searchQuery && (
            <h2 className="text-2xl font-bold mb-6 capitalize">
              {categorySlug.replace('-', ' ')}
            </h2>
          )}

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
                No products found {searchQuery ? `for "${searchQuery}"` : 'in this category'}
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or browse our other categories
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;