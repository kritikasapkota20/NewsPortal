import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const EXCLUDED_CATEGORIES = ["entertainment", "sports", "health"];

const Post = () => {
  const { slug } = useParams(); // Changed from categorySlug to slug
  const [news, setNews] = useState([]);
  const [mainNews, setMainNews] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  function formatRelativeOrExactDate(dateString) {
  const now = new Date();
  const createdAt = new Date(dateString);

  const diffInMs = now - createdAt;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 1) {
    return "Today";
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays <= 7) {
    return `${diffInDays} days ago`;
  } else {
    return createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}


  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', '10');
        if (slug) params.set('categorySlug', slug);

        const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPostsPaginated?${params.toString()}`);

        const posts = response.data.posts || [];
        setTotalPages(response.data.totalPages || 1);

        if (posts.length > 0) {
          setMainNews(posts[0]);
          setNews(posts.slice(1));
          setCategories([posts[0].category?.name || ""]);
        } else {
          setMainNews(null);
          setNews([]);
          setCategories([""]);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [slug, page]);

  if (isLoading) {
    return (
      <div className="pt-2 pb-12">
        <div className="mx-auto md:px-12 px-6 py-16 w-full bg-white shadow-lg flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-gray-200 border-t-[#F05922] rounded-full animate-spin" aria-label="Loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-12">
      <div className="mx-auto md:px-12 px-6 py-6 w-full bg-white shadow-lg space-y-10">
        {/* Section Header with Dynamic Category */}
        <div className="pb-8">
          <div className="flex items-center">
            {categories.map((cat) => (
              <h2
                key={cat}
                className="text-2xl text-[#F05922] font-bold whitespace-nowrap mr-4"
              >
                {cat}
              </h2>
            ))}
            <div className="flex flex-col w-full leading-none">
              <p className="border-b-[2px] border-[#eb6534] w-full"></p>
              <p className="border-b-[2px] border-[#0066B3] w-full mt-[1px]"></p>
            </div>
          </div>
        </div>

        {/* Main News */}
        {mainNews ? (
          <div className="flex gap-12 flex-col md:flex-row">
            <div className="md:w-[70%]">
              <img
                className="rounded-lg object-cover cursor-pointer w-full h-[500px]"
                src={
                  mainNews.image.startsWith("http")
                    ? mainNews.image
                    : `http://localhost:5000${mainNews.image}`
                }
                alt="Main News"
              />
            </div>
            <div className="md:w-[50%] md:mt-6">
            <Link to={`/${(mainNews.category?.slug || '').toLowerCase()}/${mainNews._id}/${mainNews.slug}`} key={mainNews._id}>

              <h1 className="font-bold md:text-[32px] text-[24px] cursor-pointer hover:text-[#F05922] mb-5 md:mb-7">
                {mainNews.title}
              </h1>
              </Link>
              {/* <p className="text-sm text-[#0066B3] font-medium capitalize mb-4">
                {mainNews.category?.name || "Uncategorized"}
              </p> */}
              <p className="text-[17px] text-[#333333]">
                {mainNews.content.slice(0, 180)}...
              </p>
              <span className="text-sm text-gray-500 block mt-3">
              {formatRelativeOrExactDate(mainNews.createdAt)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500"></p>
        )}

        {/* <div className="border-[#dfdcdc] border-[1px]"></div> */}

        {/* Other News */}
        <div className="flex flex-col gap-8">
          {news.length === 0 && !mainNews ? (
            <p className="text-center text-gray-500">News not found</p>
          ) : null}
          {news.map((item) => (
            <Link to={`/${(item.category?.slug || '').toLowerCase()}/${item._id}/${item.slug}`} key={item._id}>
              <motion.div
                className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-1 md:w-80 w-full space-y-4">
                  <h3 className="text-xl font-bold text-[#595A5C] hover:text-[#F05922] transition-colors duration-300">
                    {item.title}
                  </h3>
                  {/* <p className="text-sm text-[#0066B3] font-medium capitalize">
                    {item.category?.name || "Uncategorized"}
                  </p> */}
                  <p className="text-[#333333] text-[15px]">
                    {item.content.slice(0, 150)}...
                  </p>
                  <span className="text-sm text-gray-500 block">
                      {formatRelativeOrExactDate(item.createdAt)}
                  </span>
                </div>
                <div className="md:w-52 md:h-32 w-full flex-shrink-0">
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:5000${item.image}`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="mx-auto md:px-12 px-6 py-4 w-full bg-white shadow-lg flex items-center gap-4">
        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
          // Window the pages around current
          const half = Math.floor(5 / 2);
          let start = Math.max(1, page - half);
          let end = Math.min(totalPages, start + 5 - 1);
          // adjust start if at end
          start = Math.max(1, Math.min(start, end - 5 + 1));
          const pageNum = start + idx;
          if (pageNum > end) return null;
          const isActive = pageNum === page;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded-full ${isActive ? 'bg-secondary text-white transition-transform hover:scale-95' : 'bg-orange-400 text-white transition-transform hover:scale-110'}`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          className={`px-6 py-2 rounded-full ${page >= totalPages ? 'bg-secondary text-white hover:scale-95 transition-transform' : 'bg-secondary text-white hover:scale-95 transition-transform'}`}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default Post;
