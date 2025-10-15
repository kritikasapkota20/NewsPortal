import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HealthDetails from './HealthDetails';
import EntertainmentDetails from '../Pages/EntertainmentDetails';
import Samachardetails from './Samachardetails';

const DynamicDetails = () => {
  const { category, id, slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`);
        const posts = response.data.posts;
        // console.log(posts);
        
        // Find the post by ID
        const foundPost = posts.find((item) => item._id === id);
        
        if (!foundPost) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        setPost(foundPost);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F05922] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600">{error || 'The requested post could not be found.'}</p>
        </div>
      </div>
    );
  }

  // Determine which component to render based on category slug
  const categorySlug = post.category?.slug?.toLowerCase();

  // Create a wrapper component that passes the post data as props
  const renderDetailComponent = () => {
    switch (categorySlug) {
      case 'health':
        return <HealthDetails data={post} />;
      case 'entertainment':
        return <EntertainmentDetails data={post} />;
      default:
        // For all other categories (samachar, economy, etc.)
        return <Samachardetails data={post} />;
    }
  };

  return renderDetailComponent();
};

export default DynamicDetails; 