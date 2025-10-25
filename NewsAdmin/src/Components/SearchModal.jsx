import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaNewspaper, FaUser, FaFolder } from 'react-icons/fa';
import axios from 'axios';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    categories: []
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
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults({ posts: [], users: [], categories: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    setShowResults(true);

    try {
      const [postsRes, categoriesRes, usersRes] = await Promise.allSettled([
        axios.get(`http://localhost:5000/api/post/search?q=${encodeURIComponent(query)}&limit=5`),
        axios.get(`http://localhost:5000/api/categories`),
        axios.get(`http://localhost:5000/api/user/getUsers`, { withCredentials: true })
      ]);

      const posts = postsRes.status === 'fulfilled' ? postsRes.value.data.results || [] : [];
      const allCategories = categoriesRes.status === 'fulfilled' 
        ? (categoriesRes.value.data.categories || []) 
        : [];
      
      const categories = allCategories.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase())
      );
      
      const allUsers = usersRes.status === 'fulfilled' ? usersRes.value.data || [] : [];
      const users = allUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      setSearchResults({ posts, users, categories });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ posts: [], users: [], categories: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (resultType, id, category) => {
    onClose();
    setSearchQuery('');
    
    switch (resultType) {
      case 'post':
        navigate(`/Admin/edit-post/${category}/${id}`);
        break;
      case 'user':
        navigate(`/Admin/users`);
        break;
      case 'category':
        navigate(`/Admin/manage-categories`);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults({ posts: [], users: [], categories: [] });
    setShowResults(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const totalResults = searchResults.posts.length + searchResults.users.length + searchResults.categories.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search posts, users, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {showResults && searchQuery.length >= 2 && (
          <div className="max-h-[500px] overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0065B3]"></div>
              </div>
            ) : totalResults > 0 ? (
              <div className="p-4">
                {/* Categories First */}
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
                          onClick={() => handleResultClick('category', category._id)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-[#0065B3] hover:bg-blue-50 cursor-pointer transition-colors group"
                        >
                          <p className="font-medium text-gray-900 group-hover:text-[#0065B3] transition-colors">
                            {category.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts Second */}
                {searchResults.posts.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <FaNewspaper />
                      <h3 className="font-semibold">Posts ({searchResults.posts.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {searchResults.posts.map((post) => (
                        <div
                          key={post._id}
                          onClick={() => handleResultClick('post', post._id, post.category?.name)}
                          className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                        >
                          {post.image && (
                            <img
                              src={`http://localhost:5000${post.image}`}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-[#0065B3] transition-colors truncate">
                              {post.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {post.category?.name || 'Uncategorized'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Last */}
                {searchResults.users.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <FaUser />
                      <h3 className="font-semibold">Users ({searchResults.users.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {searchResults.users.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleResultClick('user', user._id)}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#0065B3] flex items-center justify-center text-white font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-[#0065B3] transition-colors">
                              {user.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
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

        {(!showResults || searchQuery.length < 2) && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <FaSearch className="text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500 text-center">
              {searchQuery.length > 0 
                ? 'Type at least 2 characters to search' 
                : 'Start typing to search...'}
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
