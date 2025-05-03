import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = 'recent_searches';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (term) => {
    const newSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(newSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearch(searchTerm.trim());
      const params = new URLSearchParams();
      params.set('q', searchTerm.trim());
      if (currentCategory) {
        params.set('category', currentCategory);
      }
      navigate(`/?${params.toString()}`);
      setShowRecent(false);
    }
  };

  const handleSearchClick = (term) => {
    setSearchTerm(term);
    const params = new URLSearchParams();
    params.set('q', term);
    if (currentCategory) {
      params.set('category', currentCategory);
    }
    navigate(`/?${params.toString()}`);
    setShowRecent(false);
  };

  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    const newSearches = recentSearches.filter(s => s !== term);
    setRecentSearches(newSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowRecent(true)}
            placeholder={currentCategory 
              ? `Search in ${currentCategory.replace('-', ' ')}...`
              : "Search products..."
            }
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark"
          >
            Search
          </button>
        </div>
      </form>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200"
          onMouseLeave={() => setShowRecent(false)}
        >
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-900 px-3 py-2">
              Recent Searches
            </h3>
            {recentSearches.map((term) => (
              <div
                key={term}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => handleSearchClick(term)}
              >
                <span className="text-gray-700">{term}</span>
                <button
                  onClick={(e) => removeRecentSearch(e, term)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;