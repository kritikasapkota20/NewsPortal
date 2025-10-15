import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Health = () => {
  const [healthPosts, setHealthPosts] = useState([]);
  const [headNews, setHeadNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get (`${import.meta.env.VITE_SERVERAPI}/post/getPosts`)
        const posts = response.data.posts;
        
        // Filter posts that belong to the Health category
        const health = posts
          .filter((item) => item.category?.slug?.toLowerCase() === 'health')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Find first post marked as isHeading (if any)
        const headingPost = health.find((post) => post.isMainNews);
        console.log("Health posts:", headingPost);
        if (headingPost) {
          setHeadNews(headingPost);
          setHealthPosts(health.filter((post) => post._id !== headingPost._id));
        } else if (health.length > 0) {
          setHeadNews(health[0]);
          setHealthPosts(health.slice(1));
        } else {
          setHealthPosts([]);
        }
        // console.log("Health posts:", healthPosts.category?.name );
      } catch (error) {
        console.error('Error fetching health posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="pt-2 pb-12">
        <div className="mx-auto px-6 md:px-12 py-16 w-[100%] bg-white shadow-lg flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-gray-200 border-t-[#F05922] rounded-full animate-spin" aria-label="Loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-12">
      <div className="mx-auto px-6 md:px-12 py-6 w-[100%] bg-white shadow-lg space-y-10">
        {/* header section */}
        <div className="pb-8">
          <div className="flex items-center">
            <h2 className="text-2xl text-[#F05922] font-bold mr-4 whitespace-nowrap">{headNews?.category?.name || healthPosts[0]?.category?.name || 'Health'}</h2>
            <div className="flex flex-col w-full leading-none">
              <p className="border-b-[2px] border-[#F05922] w-full"></p>
              <p className="border-b-[2px] border-[#0066B3] w-full mt-[1px]"></p>
            </div>
          </div>
        </div>

        {/* Head News Section */}
        {headNews && (
          <Link to={`/${(headNews.category?.slug || '').toLowerCase()}/${headNews._id}/${headNews.slug}`} className="mb-8">
            <div className="flex gap-12 flex-col md:flex-row cursor-pointer">
              <div className="md:w-[70%]">
                <img
                  src={headNews.image?.startsWith('http') ? headNews.image : `http://localhost:5000${headNews.image}`}
                  className="rounded-lg object-cover w-full"
                  alt={headNews.title}
                />
              </div>
              <div className="md:w-[50%] md:mt-6">
                <h1 className="font-bold md:text-[32px] text-[24px] hover:text-[#F05922] mb-5 transition-colors duration-300">
                  {headNews.title}
                </h1>
                <p className="text-[17px] text-[#333333]">
                  {headNews.description}
                </p>
              </div>
            </div>
          </Link>
        )}

        <div className="border-[#d3d1d1] border-[1.5px]"></div>

        {/* Empty state when no news after loading */}
        {!headNews && healthPosts.length === 0 ? (
          <p className="text-center text-gray-500">News not found</p>
        ) : null}

        {/* Health News List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {healthPosts.map((news) => (
            <Link key={news._id} to={`/${(news.category?.slug || '').toLowerCase()}/${news._id}/${news.slug}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="relative">
                  <img
                    src={news.image?.startsWith('http') ? news.image : `http://localhost:5000${news.image}`}
                    alt={news.title}
                    className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h1 className="font-bold text-lg cursor-pointer text-[#595A5C] transition-colors duration-300 hover:text-[#F05922]">
                    {news.title}
                  </h1>
                  <p className="text-[14px] text-gray-500 text-right">{news.time}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Health;