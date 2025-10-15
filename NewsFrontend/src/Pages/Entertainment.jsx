import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Filmandbollywood, Gossipandsong, Gallery } from "../Components/props/Entertainment";

const Entertainment = () => {
  const [entertainmentPosts, setEntertainmentPosts] = useState([]);
  const [mainNews, setMainNews] = useState(null);
  const [headingNews, setHeadingNews] = useState(null);
  const [loading, setLoading] = useState(true);

  const subCategories = [
    "Filmy Entertainment",
    "Gossip",
    "Gallery",
    "Bollywood/Hollywood",
    "Singing",
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`)
        // ("http://localhost:5000/api/post/getPosts");
        const posts = response.data.posts;
        // console.log("Fetched posts:", posts);

        // Filter posts that belong to the Entertainment category
        const entPosts = posts
          .filter((item) => item.category?.slug?.toLowerCase() === "entertainment")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Find first post marked as isHeading (if any)
        const headingPost = entPosts.find((post) => post.isMainNews);
        console.log("Entertainment posts:", headingPost);

        if (headingPost) {
          setHeadingNews(headingPost);
          // Remove the heading post from general entertainment list
          const rest = entPosts.filter((post) => post._id !== headingPost._id);
          setEntertainmentPosts(rest);
        } else if (entPosts.length > 0) {
          // No heading post found, use latest as main
          setMainNews(entPosts[0]);
          setEntertainmentPosts(entPosts.slice(1));
        } else {
          setEntertainmentPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filterBySubcategory = (subcategory) =>
    entertainmentPosts.filter(
      (post) =>
        post.subCategory &&
        post.subCategory.toLowerCase() === subcategory.toLowerCase()
    );

  if (loading) {
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
        {/* Header */}
        <div className="pb-8">
          <div className="flex items-center">
            <h2 className="text-2xl text-[#F05922] font-bold mr-4">{mainNews?.category?.name || entertainmentPosts[0]?.category?.name || 'Entertainment'}</h2>
            <div className="flex flex-col w-full leading-none">
              <p className="border-b-[2px] border-[#F05922] w-full"></p>
              <p className="border-b-[2px] border-[#0066B3] w-full mt-[1px]"></p>
            </div>
          </div>
        </div>

        {/* Heading News if available */}
        {headingNews && (
          <Link to={`/${(headingNews.category?.slug || '').toLowerCase()}/${headingNews._id}/${headingNews.slug}`}>
            <div className="relative cursor-pointer">
              <img
                src={
                  headingNews.image?.startsWith("http")
                    ? headingNews.image
                    : `http://localhost:5000${headingNews.image}`
                }
                alt="Heading News"
                className="w-full rounded-lg h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-[50%] bg-black bg-opacity-30 flex items-center justify-center rounded-b-lg">
                <p className="text-center text-white md:text-[32px] text-[18px] font-bold w-[90%] hover:text-[#dfdede]">
                  {headingNews.title}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Main News if no heading post */}
        {!headingNews && mainNews && (
          <Link to={`/${(mainNews.category?.slug || '').toLowerCase()}/${mainNews._id}/${mainNews.slug}`}>
            <div className="relative cursor-pointer">
              <img
                src={
                  mainNews.image?.startsWith("http")
                    ? mainNews.image
                    : `http://localhost:5000${mainNews.image}`
                }
                alt="Main News"
                className="w-full rounded-lg h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-[50%] bg-black bg-opacity-30 flex items-center justify-center rounded-b-lg">
                <p className="text-center text-white md:text-[32px] text-[18px] font-bold w-[90%] hover:text-[#dfdede]">
                  {mainNews.title}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Empty state when no news after loading */}
        {!headingNews && !mainNews && entertainmentPosts.length === 0 ? (
          <p className="text-center text-gray-500">News not found</p>
        ) : null}

        {/* Subcategory News Sections */}
        {subCategories.map((subCat) => {
          const filteredNews = filterBySubcategory(subCat);
          if (filteredNews.length === 0) return null;

          if (subCat === "Gallery") {
            return <Gallery key={subCat} newsarray={filteredNews} heading={subCat} />;
          } else if (subCat === "Filmy Entertainment" || subCat === "Bollywood/Hollywood") {
            return (
              <Filmandbollywood
                key={subCat}
                newsarray={filteredNews}
                mainimg={
                  `http://localhost:5000${filteredNews[0]?.image}`
                }
                heading={subCat}
              />
            );
          } else {
            return (
              <Gossipandsong key={subCat} newsarray={filteredNews} heading={subCat} />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Entertainment;
