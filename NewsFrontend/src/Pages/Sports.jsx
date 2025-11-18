import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sports = () => {
  const [sportsPosts, setSportsPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`);
        const allPosts = res.data?.posts || [];
        const sports = allPosts
          .filter((post) => post.category?.slug?.toLowerCase() === "sports")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (sports.length > 0) {
          setFeaturedPost(sports[0]);
          setSportsPosts(sports.slice(1));
        } else {
          setFeaturedPost(null);
          setSportsPosts([]);
        }
      } catch (error) {
        console.error("Failed to load sports posts", error);
        setFeaturedPost(null);
        setSportsPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  if (loading) {
    return (
      <div className="pt-2 pb-12">
        <div className="mx-auto md:px-12 px-6 py-16 w-full bg-white shadow-lg flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-gray-200 border-t-[#F05922] rounded-full animate-spin" aria-label="Loading" />
        </div>
      </div>
    );
  }

  const imageUrl = (src) => {
    if (!src) return "https://via.placeholder.com/800x450?text=No+Image";
    return src.startsWith("http") ? src : `http://localhost:5000${src}`;
  };

  return (
    <div className="pt-2 pb-12">
      <div className="mx-auto md:px-12 px-6 py-6 w-full bg-white shadow-lg space-y-10">
        <div className="pb-8">
          <div className="flex items-center">
            <h2 className="text-2xl text-[#F05922] font-bold mr-4 whitespace-nowrap">
              {featuredPost?.category?.name || sportsPosts[0]?.category?.name || "Sports"}
            </h2>
            <div className="flex flex-col w-full leading-none">
              <p className="border-b-[2px] border-[#F05922] w-full"></p>
              <p className="border-b-[2px] border-[#0066B3] w-full mt-[1px]"></p>
            </div>
          </div>
        </div>

        {featuredPost && (
          <Link to={`/${(featuredPost.category?.slug || "").toLowerCase()}/${featuredPost._id}/${featuredPost.slug}`}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-[65%]">
                <img
                  src={imageUrl(featuredPost.image)}
                  alt={featuredPost.title}
                  className="rounded-lg w-full object-cover max-h-[480px]"
                />
              </div>
              <div className="md:w-[35%] space-y-4 md:mt-6">
                <span className="uppercase tracking-wide text-sm text-[#F05922]">Top Story</span>
                <h1 className="font-bold md:text-[32px] text-[24px] hover:text-[#F05922] transition-colors duration-300">
                  {featuredPost.title}
                </h1>
                <p className="text-[15px] text-[#333333] leading-relaxed line-clamp-6">
                  {featuredPost.content?.slice(0, 400)}{featuredPost.content?.length > 400 ? "..." : ""}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Link>
        )}

        <div className="border-[#d3d1d1] border-[1.5px]"></div>

        {(!featuredPost && sportsPosts.length === 0) && (
          <p className="text-center text-gray-500">No sports news available.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sportsPosts.map((post) => (
            <Link key={post._id} to={`/${(post.category?.slug || "").toLowerCase()}/${post._id}/${post.slug}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <img src={imageUrl(post.image)} alt={post.title} className="w-full h-56 object-cover" />
                <div className="p-6 space-y-4">
                  <h2 className="font-bold text-lg text-[#2f2f2f] hover:text-[#F05922] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sports;

