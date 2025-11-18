import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getViewedCategories } from '../utils/viewTracker';

const PersonalizedRecommendations = ({ title = 'Recommended for you', limit = 6 }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const viewedCategories = getViewedCategories();
        if (!viewedCategories || Object.keys(viewedCategories).length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }
        const res = await axios.post(`${import.meta.env.VITE_SERVERAPI}/post/recommendations`, { viewedCategories });
        const posts = res.data?.posts || [];
        setItems(posts.slice(0, limit));
      } catch (e) {
        setError('Failed to load recommendations');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return null;
  }

  const getArticleLink = (article) => {
    const categorySlug = article.category?.slug?.toLowerCase() || 'category';
    return `/${categorySlug}/${article._id}/${article.slug}`;
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (image.startsWith('http')) return image;
    return `http://localhost:5000${image}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((article) => (
          <Link key={article._id} to={getArticleLink(article)} className="group block rounded-lg overflow-hidden bg-gray-50 hover:shadow-md">
            <div className="w-full h-40 overflow-hidden bg-gray-200">
              <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <div className="text-xs text-[#F05922] font-semibold mb-1">{article.category?.name}</div>
              <div className="font-semibold text-gray-800 line-clamp-2 group-hover:text-[#F05922]">{article.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;



