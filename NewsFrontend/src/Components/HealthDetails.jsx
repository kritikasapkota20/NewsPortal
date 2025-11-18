import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import UseDate from './UseDate';
import { BsClock } from 'react-icons/bs';
import axios from 'axios';
import ArticleRecommendations from './ArticleRecommendations';
import { recordPostView } from '../utils/viewTracker';

const HealthDetails = ({ data }) => {
    const { id } = useParams();
    const { nepaliDate } = UseDate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // If data is passed as prop, use it directly
        if (data) {
            setNews(data);
            setLoading(false);
            return;
        }

        // Fallback to fetching data if no prop is passed
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`);
                const posts = response.data.posts;
                const healthPosts = posts.filter((item) => item.category?.slug?.toLowerCase() === 'health');
                const found = healthPosts.find((item) => item._id === id);
                setNews(found);
            } catch (error) {
                console.error('Error fetching health news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id, data]);

    useEffect(() => {
        if (news?._id) {
            try { recordPostView(news); } catch(_) {}
        }
    }, [news]);

  useEffect(() => {
    if (!news?._id) return;
    const incrementViews = async () => {
      try {
        await axios.patch(`${import.meta.env.VITE_SERVERAPI}/post/incrementView/${news._id}`);
      } catch (err) {
        console.error('Failed to increment view count', err);
      }
    };
    incrementViews();
  }, [news?._id]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!news) {
        return <div>News item not found.</div>;
    }

    return (
        <div className="px-6 md:px-12 py-6">
            {/* Section Header */}
            <div className="px-4 py-2 mb-6 inline-block bg-[#F05922]">
                <h2 className="text-xl text-white font-bold">{news.category?.name}</h2>
            </div>
            {/* Main Content Container */}
            <div className="flex flex-col lg:flex-row gap-7">
                {/* Main News Section */}
                <div className="lg:w-7/12 w-full">
                    <h1 className="text-3xl lg:text-[34px] font-bold mb-7">{news.title}</h1>
                    {/* Date & Time */}
                    <div className="flex mb-4 gap-2 items-center text-sm text-[#3f3d3d]">
                        <BsClock />
                        <p className="m-0">{new Date(news.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}</p>
                    </div>
                    <img
                        alt={news.title}
                        src={news.image?.startsWith('http') ? news.image : `http://localhost:5000${news.image}`}
                        className="w-full mb-6 max-h-[500px]  object-cover"
                    />
                    <div className="py-6 text-base text-[#2A2A2A] text-justify">
                        {news.content?.split("\n\n").map((paragraph, i) => (
                            <React.Fragment key={i}>
                                <p className='leading-relaxed whitespace-pre-wrap'>{paragraph}</p>
                                <p>h</p>
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Sidebar News List */}
                <motion.div
                    className="lg:w-5/12 w-full bg-white shadow-2xl py-2 px-4 max-h-fit border-t-2 border-[#f3e7e7]"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="container mx-auto py-4">
                        <div className="flex items-center">
                            <h2 className="text-xl text-[#F05922] font-bold whitespace-nowrap mr-4">Related Posts</h2>
                            <div className="flex flex-col w-full leading-none">
                                <p className="border-b-[2px] border-[#eb6534] w-full"></p>
                                <p className="border-b-[2px] border-[#0066B3] w-full mt-[1px]"></p>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar: List all health news except current */}
                    {news && (
                        <>
                        {/* Fetch all health news for sidebar */}
                        {/* This can be optimized by storing all health posts in context or parent, but for now, fetch again */}
                        <SidebarHealthNews currentId={news._id} />
                        </>
                    )}
                </motion.div>
            </div>
            <div>
                <motion.div className=' bg-[white] shadow-2xl lg:w-7/12 w-full p-4 text-[] border-t-[1px] border-[#cecccc]  font-semibold ' whileHover={{ scale: 1.02 }}>
                    <p className='mb-3 text-[16px]'>Leave a Comment **</p>
                    <form >
                        <p className='text-[#4c4a4a]  mb-4'>0 Comments</p>
                        <input required
                            type="text"
                            placeholder="Add a comment"
                            className="w-full h-16 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                        <div className=' flex justify-end'> <button className=' mt-4 border-none bg-[#f26a39] text-white py-2 px-2 hover:bg-[#F05922]   ' type='submit'>Add Comment</button>
                        </div></form>
                </motion.div>
            </div>
            
            {/* Article Recommendations Section */}
            {news?._id && (
                <ArticleRecommendations 
                    articleId={news._id} 
                    title="You might also like"
                />
            )}
        </div>
    );
};

// SidebarHealthNews component to show other health news
const SidebarHealthNews = ({ currentId }) => {
    const [healthPosts, setHealthPosts] = useState([]);
    useEffect(() => {
        const fetchSidebar = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`);
                const posts = response.data.posts;
                const health = posts.filter((item) => item.category?.slug?.toLowerCase() === 'health');
                setHealthPosts(health.filter((item) => item._id !== currentId));
            } catch (error) {
                setHealthPosts([]);
            }
        };
        fetchSidebar();
    }, [currentId]);
    return (
        <>
            {healthPosts.map((item, i) => (
                <div key={i} className="mb-4">
                    <motion.div className="flex gap-4 items-center" whileHover={{ scale: 1.02 }}>
                        <img
                            src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                            className="w-[90px] h-[60px] object-cover"
                            alt={item.title}
                        />
                        <div>
                            <Link to={`/NewsDetails/${item._id}/${item.slug}`}>
                                <p className="cursor-pointer hover:text-[#F05922] text-sm lg:text-[15px] font-semibold">
                                    {item.title}
                                </p>
                            </Link>
                        </div>
                    </motion.div>
                    <p className="text-[#424040] text-xs lg:text-[13px] text-right mt-1">{item.time}</p>
                    <div className="border border-[#e1dede] mt-2"></div>
                </div>
            ))}
        </>
    );
};

export default HealthDetails;
