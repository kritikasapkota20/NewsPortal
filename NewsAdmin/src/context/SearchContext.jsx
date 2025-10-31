import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    comments: [],
    categories: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const searchAll = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults({ posts: [], users: [], comments: [], categories: [] });
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    try {
      const [postsRes, usersRes, commentsRes, categoriesRes] = await Promise.allSettled([
        axios.get(`http://localhost:5000/api/post/search?q=${encodeURIComponent(query)}`),
        axios.get(`http://localhost:5000/api/user/search?q=${encodeURIComponent(query)}`),
        axios.get(`http://localhost:5000/api/comment/search?q=${encodeURIComponent(query)}`),
        axios.get(`http://localhost:5000/api/category/search?q=${encodeURIComponent(query)}`)
      ]);

      setSearchResults({
        posts: postsRes.status === 'fulfilled' ? postsRes.value.data.results || [] : [],
        users: usersRes.status === 'fulfilled' ? usersRes.value.data.results || [] : [],
        comments: commentsRes.status === 'fulfilled' ? commentsRes.value.data.results || [] : [],
        categories: categoriesRes.status === 'fulfilled' ? categoriesRes.value.data.results || [] : []
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ posts: [], users: [], comments: [], categories: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults({ posts: [], users: [], comments: [], categories: [] });
    setShowSearchModal(false);
  }, []);

  const value = {
    searchResults,
    isSearching,
    searchQuery,
    showSearchModal,
    setShowSearchModal,
    searchAll,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};


