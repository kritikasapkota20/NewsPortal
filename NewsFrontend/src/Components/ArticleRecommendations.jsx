import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaTag } from 'react-icons/fa';

const buildImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/320x200?text=No+Image';
  if (image.startsWith('http')) return image;
  return `${import.meta.env.VITE_SERVERAPIIMG || 'http://localhost:5000'}${image}`;
};

const ArticleRecommendations = ({ articleId = null, title = "You might also like", limit = 5 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api';
        const url = articleId
          ? `${base}/post/recommendations/${articleId}`
          : `${base}/post/trending?limit=${limit}`;

        const response = await axios.get(url);

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

  if (recommendations.length === 0) {
    return null;
  }

  const getArticleLink = (article) => {
    const categorySlug = article.category?.slug?.toLowerCase() || 'category';
    return `/${categorySlug}/${article._id}/${article.slug}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        {title}
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x">
        {recommendations.map((article) => {
          const views = article.viewCount ?? article.views ?? 0;
          const tags = article.tags?.slice(0, 2) || [];

          return (
            <Link
              key={article._id}
              to={getArticleLink(article)}
              className="flex-shrink-0 w-80 snap-start group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                <img
                  src={buildImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/320x200?text=No+Image';
                  }}
                />
                {article.category && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#F05922] text-white text-xs font-semibold px-2 py-1 rounded">
                      {article.category.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <h4 className="font-semibold text-gray-800 text-lg line-clamp-2 group-hover:text-[#F05922] transition-colors">
                  {article.title}
                </h4>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                    {tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border">
                        <FaTag className="text-purple-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <FaEye className="text-blue-500" />
                    {views} views
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
          );
        })}
      </div>
    </div>
  );
};

export default ArticleRecommendations;

