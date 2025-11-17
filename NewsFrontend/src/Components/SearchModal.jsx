import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaNewspaper, FaFolder } from 'react-icons/fa';
import axios from 'axios';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchMode, setSearchMode] = useState('text'); // 'text' or 'date'
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchResults, setSearchResults] = useState({
    posts: [],
    categories: [],
    recommended: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Add global keydown listener for ESC key
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleGlobalKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchMode === 'text') {
      const delaySearch = setTimeout(() => {
        if (searchQuery.trim().length >= 2) {
          performTextSearch(searchQuery);
        } else {
          setSearchResults({ posts: [], categories: [], recommended: [] });
          setShowResults(false);
        }
      }, 300);
      return () => clearTimeout(delaySearch);
    }
  }, [searchQuery, searchMode]);

  useEffect(() => {
    if (searchMode === 'date' && dateRange.startDate && dateRange.endDate) {
      performDateSearch(dateRange.startDate, dateRange.endDate);
    } else if (searchMode === 'date') {
      setSearchResults({ posts: [], categories: [], recommended: [] });
      setShowResults(false);
    }
  }, [dateRange, searchMode]);

  const performTextSearch = async (query) => {
    setIsSearching(true);
    setShowResults(true);

    try {
      const searchUrl = `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/post/search?q=${encodeURIComponent(query)}&limit=10`;

      const [postsRes, categoriesRes, recommendedRes] = await Promise.allSettled([
        axios.get(searchUrl),
        axios.get(`${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/categories`),
        axios.get(`${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/post/recommendedPosts`)
      ]);

      const posts = postsRes.status === 'fulfilled' ? postsRes.value.data.results || [] : [];
      const allCategories = categoriesRes.status === 'fulfilled' 
        ? (categoriesRes.value.data.categories || []) 
        : [];
      
      const categories = allCategories.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      
      // Use recommended posts as trending/results
      const recommended = recommendedRes.status === 'fulfilled' 
        ? recommendedRes.value.data.posts || [] 
        : [];

      setSearchResults({ posts, categories, recommended });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ posts: [], categories: [], recommended: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const performDateSearch = async (startDate, endDate) => {
    setIsSearching(true);
    setShowResults(true);

    try {
      // Search for posts within date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date

      // We'll need to search day by day or use a backend endpoint that supports date ranges
      // For now, let's search each date in the range
      const allPosts = [];
      const currentDate = new Date(start);
      
      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/post/search?date=${dateStr}&limit=50`
          );
          if (res.data.results) {
            allPosts.push(...res.data.results);
          }
        } catch (err) {
          console.error(`Error searching date ${dateStr}:`, err);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Remove duplicates based on post ID
      const uniquePosts = Array.from(
        new Map(allPosts.map(post => [post._id, post])).values()
      );

      // Sort by date (newest first)
      uniquePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setSearchResults({
        posts: uniquePosts.slice(0, 50), // Limit to 50 results
        categories: [],
        recommended: []
      });
    } catch (error) {
      console.error('Date search error:', error);
      setSearchResults({ posts: [], categories: [], recommended: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (post) => {
    if (!post || !post.category || !post._id) return;
    
    onClose();
    setSearchQuery('');
    
    const categorySlug = post.category.slug?.toLowerCase() || '';
    const postSlug = post.slug || '';
    navigate(`/${categorySlug}/${post._id}/${postSlug}`);
  };

  const handleCategoryClick = (category) => {
    onClose();
    setSearchQuery('');
    
    const slug = category.slug?.toLowerCase() || category.name?.toLowerCase() || '';
    const specialRoutes = ["entertainment", "health", "sports"];
    
    if (specialRoutes.includes(slug)) {
      navigate(`/category/${slug.charAt(0).toUpperCase() + slug.slice(1)}`);
    } else {
      navigate(`/category/${slug}`);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setDateRange({ startDate: '', endDate: '' });
    setSearchMode('text');
    setSearchResults({ posts: [], categories: [], recommended: [] });
    setShowResults(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const totalResults = searchResults.posts.length + searchResults.categories.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          {/* Search Mode Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setSearchMode('text');
                setDateRange({ startDate: '', endDate: '' });
                setSearchResults({ posts: [], categories: [], recommended: [] });
                setShowResults(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchMode === 'text'
                  ? 'bg-[#0066B3] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaSearch className="inline mr-2" />
              Search by Text/Category
            </button>
            <button
              onClick={() => {
                setSearchMode('date');
                setSearchQuery('');
                setSearchResults({ posts: [], categories: [], recommended: [] });
                setShowResults(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchMode === 'date'
                  ? 'bg-[#0066B3] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaNewspaper className="inline mr-2" />
              Search by Date Range
            </button>
          </div>

          <div className="flex items-center gap-4">
            {searchMode === 'text' ? (
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search news, articles, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066B3] focus:border-transparent"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    max={dateRange.endDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066B3] focus:border-transparent"
                  />
                </div>
                <span className="text-gray-400 mt-5">to</span>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    min={dateRange.startDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066B3] focus:border-transparent"
                  />
                </div>
                {(dateRange.startDate || dateRange.endDate) && (
                  <button
                    onClick={() => setDateRange({ startDate: '', endDate: '' })}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                    title="Clear date range"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {showResults && ((searchMode === 'text' && searchQuery.length >= 2) || (searchMode === 'date' && dateRange.startDate && dateRange.endDate)) && (
          <div className="max-h-[500px] overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066B3]"></div>
              </div>
            ) : totalResults > 0 ? (
              <div className="p-4">
                {/* Categories Results */}
                {searchResults.categories.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <FaFolder />
                      <h3 className="font-semibold">Categories ({searchResults.categories.length})</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {searchResults.categories.map((category) => (
                        <div
                          key={category._id}
                          onClick={() => handleCategoryClick(category)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-[#0066B3] hover:bg-blue-50 cursor-pointer transition-colors group"
                        >
                          <p className="font-medium text-gray-900 group-hover:text-[#0066B3] transition-colors text-sm">
                            {category.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts Results */}
                {searchResults.posts.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <FaNewspaper />
                      <h3 className="font-semibold">
                        {searchMode === 'date' ? 'Posts Found' : 'Articles'} ({searchResults.posts.length})
                      </h3>
                      {searchMode === 'date' && dateRange.startDate && dateRange.endDate && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {searchResults.posts.map((post) => (
                        <div
                          key={post._id}
                          onClick={() => handleResultClick(post)}
                          className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                        >
                          {post.image && (
                            <img
                              src={`${import.meta.env.VITE_SERVERAPIIMG || 'http://localhost:5000'}${post.image}`}
                              alt={post.title}
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-[#0066B3] transition-colors line-clamp-2 mb-1">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.category?.name || 'Uncategorized'} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <FaSearch className="text-gray-300 text-4xl mb-3" />
                <p className="text-gray-500 text-center">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {(!showResults || (searchMode === 'text' && searchQuery.length < 2) || (searchMode === 'date' && (!dateRange.startDate || !dateRange.endDate))) && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <FaSearch className="text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500 text-center">
              {searchMode === 'text' 
                ? (searchQuery.length > 0 
                    ? 'Type at least 2 characters to search' 
                    : 'Start typing to search news and articles...')
                : (!dateRange.startDate || !dateRange.endDate
                    ? 'Select a date range to search for posts'
                    : 'Searching...')}
            </p>
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Press ESC to close</span>
            <span>{totalResults > 0 && `Found ${totalResults} result${totalResults > 1 ? 's' : ''}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;