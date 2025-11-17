import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * ArticleRecommendations Component
 * 
 * Displays recommended articles based on content similarity (same category or overlapping tags)
 * Can be used on article detail pages or homepage
 * 
 * @param {string} articleId - Optional. If provided, shows recommendations for that article. If not, shows trending articles
 * @param {string} title - Optional. Custom title for the recommendations section (default: "You might also like")
 * @param {number} limit - Optional. Number of recommendations to show (default: 5)
 */
const ArticleRecommendations = ({ articleId = null, title = "You might also like", limit = 5 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (articleId) {
          // Fetch content-based recommendations for a specific article
          response = await axios.get(
            `${import.meta.env.VITE_SERVERAPI}/post/recommendations/${articleId}`
          );
        } else {
          // Fetch trending articles for homepage
          response = await axios.get(
            `${import.meta.env.VITE_SERVERAPI}/post/trending?limit=${limit}`
          );
        }

        if (response.data.success) {
          setRecommendations(response.data.recommendations || []);
        } else {
          setError('Failed to fetch recommendations');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [articleId, limit]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F05922]"></div>
          <span className="ml-3 text-gray-600">Loading recommendations...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (recommendations.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No recommendations available at the moment.</p>
        </div>
      </div>
    );
  }

  // Helper function to generate article link
  const getArticleLink = (article) => {
    const categorySlug = article.category?.slug?.toLowerCase() || 'category';
    return `/${categorySlug}/${article._id}/${article.slug}`;
  };

  // Helper function to format image URL
  const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (image.startsWith('http')) return image;
    return `http://localhost:5000${image}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        {title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((article) => (
          <Link
            key={article._id}
            to={getArticleLink(article)}
            className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Article Image */}
            <div className="relative w-full h-48 overflow-hidden bg-gray-200">
              <img
                src={getImageUrl(article.image)}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              {/* Category Badge */}
              {article.category && (
                <div className="absolute top-2 left-2">
                  <span className="bg-[#F05922] text-white text-xs font-semibold px-2 py-1 rounded">
                    {article.category.name}
                  </span>
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-[#F05922] transition-colors">
                {article.title}
              </h4>
              
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {article.viewCount || 0} views
                </span>
                <span>
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticleRecommendations;

