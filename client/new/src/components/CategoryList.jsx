import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { profileService } from '../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await profileService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index}
              className="h-10 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <div className="space-y-1">
        <Link
          to="/"
          className={`block px-4 py-2 rounded-md transition-colors ${
            !slug ? 'bg-primary text-white' : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>All Products</span>
            <span className="text-sm px-2 py-0.5 rounded-full bg-opacity-20 ${
              !slug ? 'bg-white text-white' : 'bg-primary text-primary'
            }">
              {categories.reduce((total, cat) => total + cat.productCount, 0)}
            </span>
          </div>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className={`block px-4 py-2 rounded-md transition-colors ${
              slug === category.slug
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="capitalize">{category.name}</span>
              <span className={`text-sm px-2 py-0.5 rounded-full ${
                slug === category.slug
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-primary bg-opacity-10 text-primary'
              }`}>
                {category.productCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;