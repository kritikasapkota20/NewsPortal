import rastriyasava from "../assets/Homeimg/rastriya-sava.jpg";
// import rastriyasava from "../assets/Homeimg/rastriya-sava.jpg";
import samachar from "../assets/samachar.jpg";
import cricket from "../assets/img1.jpg";
import headimg1 from "../assets/headimg1.jpg"
import headimg3 from "../assets/headimg3.jpg"

import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";
import UseDate from "./UseDate";
// import { newsData } from "../Pages/Samachar";


const HomepageBody = () => {
  const { nepaliDate } = UseDate();
  const [isLoading, setIsLoading] = useState(true);
  const [headingNews,setHeadingNews] = useState([]);
  const [featuredNews,setFeaturedNews] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [healthNews, setHealthNews] = useState([]);
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [personalizedPosts, setPersonalizedPosts] = useState([]);
 
useEffect(() => {
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      // Fetch all posts
      const allPostsResponse = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`)
      const allPosts = allPostsResponse.data.posts;
      // console.log(allPosts);
      const headResponse = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/headNews`);
      const headPosts = headResponse.data.posts;
      // console.log(headPosts);

      // Filter posts that belong to the "Head News" category
      const headingNews = headPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Fetch posts where isHeading: true
      const featuredResponse = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/mainNews`);
      
      const featuredNews = featuredResponse.data.posts;
      // console.log(featuredNews);

      // Fetch categories in their creation order (oldest first)
      const categoriesResponse = await axios.get(`${import.meta.env.VITE_SERVERAPI}/categories`);
      const categories = categoriesResponse.data.categories;
      
      // Fetch recommended posts (server-side algorithm)
      const recommendedResponse = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/recommendedPosts`);
      const recommendedPosts = recommendedResponse.data.posts;
      
      // Group posts by category while maintaining category order
      const categoryGroups = [];
      const entertainmentPosts = [];
      const healthPosts = [];

      // Process categories in their original creation order
      categories.forEach(category => {
        const categorySlug = category.slug.toLowerCase();
        
        if (categorySlug === 'entertainment') {
          // Filter posts for entertainment category
          const posts = allPosts.filter(post => 
            post.category && post.category.slug && 
            post.category.slug.toLowerCase() === 'entertainment'
          ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          entertainmentPosts.push(...posts);
        } else if (categorySlug === 'health') {
          // Filter posts for health category
          const posts = allPosts.filter(post => 
            post.category && post.category.slug && 
            post.category.slug.toLowerCase() === 'health'
          ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          healthPosts.push(...posts);
        } else {
          // Filter posts for other categories
          const posts = allPosts.filter(post => 
            post.category && post.category.slug && 
            post.category.slug.toLowerCase() === categorySlug
          ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          if (posts.length > 0) {
            categoryGroups.push({
              slug: category.slug,
              name: category.name,
              posts: posts,
              categoryCreatedAt: category.createdAt
            });
          }
        }
      });

      // Update state
      setHeadingNews(headingNews || []);
      setFeaturedNews(featuredNews || []);
      setAllCategories(categoryGroups);
      setEntertainmentNews(entertainmentPosts);
      setHealthNews(healthPosts);
      setRecommendedPosts(recommendedPosts || []);
      
      // Debug: Log category order
      // console.log('Category order (oldest first):', categoryGroups.map(cat => ({
      //   name: cat.name,
      //   categoryCreatedAt: cat.categoryCreatedAt,
      //   slug: cat.slug
      // })));
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchNews();
}, []);

// Fetch personalized recommendations based on localStorage data
useEffect(() => {
  const fetchPersonalizedRecommendations = async () => {
    try {
      // Read viewedCategories from localStorage
      const viewedCategoriesData = localStorage.getItem("viewedCategories");
      
      if (viewedCategoriesData) {
        const viewedCategories = JSON.parse(viewedCategoriesData);
        
        // Check if we have any viewed categories
        if (Object.keys(viewedCategories).length > 0) {
          // Send POST request to get personalized recommendations
          const response = await axios.post(`${import.meta.env.VITE_SERVERAPI}/post/recommendations`, {
            viewedCategories
          });
          
          setPersonalizedPosts(response.data.posts || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch personalized recommendations", error);
      // If personalized recommendations fail, we still have the server-side recommendations
    }
  };

  fetchPersonalizedRecommendations();
}, []);

// Render category section with the standard UI (2 per line)
const renderCategorySection = (category, index) => {
  if (!category.posts || category.posts.length === 0) return null;
  
  const mainPost = category.posts[0];
  const remainingPosts = category.posts.slice(1, 5);
  
  return (
    <div key={category.slug} className={`${index % 2 === 0 ? 'md:w-[65%] w-full' : 'w-[35%]'} bg-gray-100 py-10 px-4`}>
      <div className="flex justify-between items-center gap-1">
        <h1 className="w-fit bg-[#F05922] font-bold text-xl text-white px-4 py-2">
          {category.name}
        </h1>
        <div className="border-[#F05922] border-t-[1.4px] flex-1"></div>
        <Link to={`/category/${category.slug}`} className="text-[#1e1e1e] transition-colors hover:text-[#F05922] duration-300 cursor-pointer">
          More
        </Link>
      </div>
      <div>
        {/* main heading */}
        <div>
          <div className="flex lg:flex-row flex-col mt-6 gap-6 cursor-pointer">
            <Link to={`/${(mainPost.category?.slug || '').toLowerCase()}/${mainPost._id}/${mainPost.slug}`}>
              <img 
                src={`${import.meta.env.VITE_SERVERAPIIMG}${mainPost.image}`} 
                alt="mainhead" 
                className="md w-full h-[300px] object-cover" 
              />
            </Link>
            <div className="items-center w-[100%] lg:w-[50%] justify-center">
              <Link to={`/${(mainPost.category?.slug || '').toLowerCase()}/${mainPost._id}/${mainPost.slug}`}>
                <h1 className="md:text-[26px] text-[16px] md:mt-6 font-bold hover:text-[#F05922]">
                  {mainPost.title}
                </h1>
              </Link>
              <p className="md:mb-0 mb-7">
                {mainPost.content ? mainPost.content.substring(0, 100) + '...' : ''}
              </p>
            </div>
          </div>
          
          {/* remaining posts */}
          <div className="mt-5">
            <div className="grid md:grid-cols-2 grid-cols-1">
              {remainingPosts.map((post, postIndex) => (
                <Link key={postIndex} to={`/${(post.category?.slug || '').toLowerCase()}/${post._id}/${post.slug}`}>
                  <div className="flex gap-3 cursor-pointer mt-3">
                    <img 
                      src={`${import.meta.env.VITE_SERVERAPIIMG}${post.image}`} 
                      className="w-24 h-16 rounded-[5px]" 
                      alt={post.title} 
                    />
                    <p className="hover:text-[#F05922] mt-2">{post.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render category section with list-style UI (for right side)
const renderCategoryListSection = (category, index) => {
  if (!category.posts || category.posts.length === 0) return null;
  return (
    <div key={category.slug} className={`${index % 2 === 0 ? 'md:w-[65%] w-full' : 'w-[35%]'} bg-gray-100 py-10 px-4`}>
      <div className="flex justify-between items-center gap-1 mb-6">
        <h1 className="w-fit bg-[#F05922] font-bold text-xl text-white px-4 py-2">
          {category.name}
        </h1>
        <div className="border-[#F05922] border-t-[1.4px] flex-1"></div>
        <Link to={`/category/${category.slug}`} className="text-[#1e1e1e] transition-colors hover:text-[#F05922] duration-300 cursor-pointer">
          More
        </Link>
      </div>
      
      {/* List of posts with timestamps */}
      <div className="space-y-4">
        {category.posts.slice(0, 6).map((post, postIndex) => (
          <Link key={postIndex} to={`/${(post.category?.slug || '').toLowerCase()}/${post._id}/${post.slug}`}>
            <div className="group cursor-pointer">
              <div className="flex justify-between items-start gap-10">
                <div className="flex-1">
                  <div className="text-xs flex text-gray leading-tight">
                  <h3 className={`font-semibold text-sm leading-tight group-hover:text-[#F05922] transition-colors
                   ${
                    // postIndex === 1 ?
                    //  'text-[#F05922]' : 'text-[#1e1e1e]'
                    <>
                    </>
                  }
                  `}>
                    {post.title}
                  </h3>
                  <img src={`${import.meta.env.VITE_SERVERAPIIMG}${post.image}`} alt={post.title} className="w-[90px] h-[60px] rounded-lg"/>
                  </div>
                  {/* <p className="text-xs text-gray-500 mt-1">{category.name}</p> */}
                </div>
                <div className="text-right ml-3">
                  <div className="text-xs text-gray-400 leading-tight">
                    {/* {new Date(post.createdAt).toLocaleTimeString("en-US", { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    }).split(' ').map((part, i) => (
                      <div key={i} className={i === 0 ? 'text-xs' : 'text-[10px]'}>{part}</div>
                    ))} */}
                  </div>
                </div>
              </div>
              {postIndex < category.posts.slice(0, 6).length - 1 && (
                <hr className="my-3 border-gray-200" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Render category section with horizontal 4-column ayout (like Sports section)
const renderCategoryHorizontal4Layout = (category) => {
  if (!category.posts || category.posts.length === 0) return null;
  
  return (
    <div className="bg-gray-100 py-10 px-4 mb-8">
      <div className="flex justify-between items-center gap-1 mb-6">
        <h1 className="w-fit bg-[#F05922] font-bold text-xl text-white px-4 py-2">
          {category.name}
        </h1>
        <div className="border-[#F05922] border-t-[1.4px] flex-1"></div>
        <Link to={`/category/${category.slug}`} className="text-[#1e1e1e] transition-colors hover:text-[#F05922] duration-300 cursor-pointer">
          More
        </Link>
      </div>
      
      {/* 4-column horizontal layout */}
      <div className="grid md:grid-cols-4 grid-cols-2 lg:grid-cols-4 gap-4">
        {category.posts.slice(0, 4).map((post, postIndex) => (
          <Link key={postIndex} to={`/${(post.category?.slug || '').toLowerCase()}/${post._id}/${post.slug}`}>
            <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src={`${import.meta.env.VITE_SERVERAPIIMG}${post.image}`} 
                alt={post.title} 
                className="w-full h-32 object-cover" 
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm leading-tight group-hover:text-[#F05922] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {post.content ? post.content.substring(0, 80) + '...' : ''}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Render category section with 2-column main layout (like International section)
const renderCategory2ColumnLayout = (category) => {
  if (!category.posts || category.posts.length === 0) return null;
  
  const mainPost = category.posts[0];
  const remainingPosts = category.posts.slice(1, 6);
  
  return (
    <div className="bg-gray-100 py-10 px-4 mb-8">
      <div className="flex justify-between items-center gap-1 mb-6">
        <h1 className="w-fit bg-[#F05922] font-bold text-xl text-white px-4 py-2">
          {category.name}
        </h1>
        <div className="border-[#F05922] border-t-[1.4px] flex-1"></div>
        <Link to={`/category/${category.slug}`} className="text-[#1e1e1e] transition-colors hover:text-[#F05922] duration-300 cursor-pointer">
          More
        </Link>
      </div>
      
      {/* 2-column layout: Main post on left, remaining posts on right */}
      <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-6">
        {/* Left column - Main post with overlay title */}
        {mainPost && (
          <div className="lg:col-span-2">
            <Link to={`/${(mainPost.category?.slug || '').toLowerCase()}/${mainPost._id}/${mainPost.slug}`}>
              <div className="relative">
                <img 
                  src={`${import.meta.env.VITE_SERVERAPIIMG}${mainPost.image}`} 
                  alt={mainPost.title} 
                  className="w-full h-96 object-cover rounded-lg" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <span className="inline-block bg-[#F05922] text-white px-3 py-1 rounded-full text-sm mb-3">
                    {category.name}
                  </span>
                  <h2 className="text-white text-2xl font-bold leading-tight">
                    {mainPost.title}
                  </h2>
                </div>
              </div>
            </Link>
          </div>
        )}
        
        {/* Right column - Remaining posts in list format */}
        {remainingPosts.length > 0 && (
          <div className="lg:col-span-1 bg-white rounded-lg p-4 shadow-md">
            <div className="space-y-4">
              {remainingPosts.map((post, postIndex) => (
                <Link key={postIndex} to={`/${(post.category?.slug || '').toLowerCase()}/${post._id}/${post.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start ">
                          <h3 className={`font-semibold text-sm leading-tight group-hover:text-[#F05922] transition-colors ${
<>
</>
                            // postIndex === 0 ? 'text-[#F05922]' : 'text-[#1e1e1e]'
                          }`}>
                            {post.title}
                          </h3>
                          <img 
                            src={`${import.meta.env.VITE_SERVERAPIIMG}${post.image}`} 
                            alt={post.title} 
                            className="w-[70px] h-[50px] object-cover rounded flex-shrink-0"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{category.name}</p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <div className="text-xs text-gray-400 leading-tight">
                          {new Date(post.createdAt).toLocaleTimeString("en-US", { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }).split(' ').map((part, i) => (
                            <div key={i} className={i === 0 ? 'text-xs' : 'text-[10px]'}>{part}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {postIndex < remainingPosts.length - 1 && (
                      <hr className="my-3 border-gray-200" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Render entertainment and health with different UI
const renderEntertainmentAndHealth = () => {
  return (
    <div className="mb-8">
      {/* Entertainment Section */}
      {entertainmentNews.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center gap-1 mb-6">
            <h1 className="w-fit bg-[#F05922] font-bold text-xl text-white px-4 py-2">
              Entertainment
            </h1>
            <div className="border-[#F05922] border-t-[1.4px] flex-1"></div>
            <Link to="/category/entertainment" className="text-[#1e1e1e] transition-colors hover:text-[#F05922] duration-300 cursor-pointer">
              More
            </Link>
          </div>
          
          {/* Horizontal scrolling cards layout */}
          <div className="flex gap-4  overflow-x-auto pb-4">
            {entertainmentNews.slice(0, 5).map((post, index) => (
              <Link key={index} to={`/${(post.category?.slug || '').toLowerCase()}/${post._id}/${post.slug}`} className="flex-shrink-0">
                <div className="relative w-64 h-80 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                  <img 
                    src={`${import.meta.env.VITE_SERVERAPIIMG}${post.image}`} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />
                   <div className="absolute inset-0 bg-black/30"></div> {/* overlay */}
                
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white text-sm font-semibold leading-tight group-hover:text-[#F05922] transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  {/* Progress dots */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Health Section */}
      {healthNews.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center gap-1 mb-6">
            <h1 className="w-fit bg-[#F05922] font-bold text-xl text-white px-4 py-2">
              Health
            </h1>
            <div className="border-[#F05922] border-t-[1.4px] flex-1"></div>
            <Link to="/category/health" className="text-[#1e1e1e] transition-colors hover:text-[#F05922] duration-300 cursor-pointer">
              More
            </Link>
          </div>
          
          {/* Horizontal scrolling cards layout */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {healthNews.slice(0, 5).map((post, index) => (
              <Link key={index} to={`/${(post.category?.slug || '').toLowerCase()}/${post._id}/${post.slug}`} className="flex-shrink-0">
                <div className="relative w-64 h-80 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                  <img 
                    src={`${import.meta.env.VITE_SERVERAPIIMG}${post.image}`} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />
                 
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white text-sm font-semibold leading-tight group-hover:text-[#F05922] transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  {/* Progress dots */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Render recommended posts section
const renderRecommendedPosts = () => {
  // Use personalized posts if available, otherwise fall back to server-side recommendations
  const postsToShow = personalizedPosts.length > 0 ? personalizedPosts : recommendedPosts;
  
  if (!postsToShow || postsToShow.length === 0) return null;
  
  // return (
  //   <div className="mb-8">
  //     <div className="flex justify-between items-center gap-1 mb-6">
  //       <h1 className="w-fit bg-[#F05922] font-bold text-xl text-white px-4 py-2">
  //         {personalizedPosts.length > 0 ? 'Personalized for You' : 'Recommended for You'}
  //       </h1>
  //       <div className="border-[#F05922] border-t-[1.4px] flex-1"></div>
  //     </div>
      
  //     {/* Grid layout for recommended posts */}
  //     <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-cols-1 gap-6">
  //       {postsToShow.map((post, index) => (
  //         <Link key={index} to={`/NewsDetails/${post._id}/${post.slug}`}>
  //           <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
  //             <div className="relative">
  //               <img 
  //                 src={`${import.meta.env.VITE_SERVERAPIIMG}${post.image}`} 
  //                 alt={post.title} 
  //                 className="w-full h-48 object-cover" 
  //               />
  //               <div className="absolute top-2 left-2">
  //                 <span className="inline-block bg-[#F05922] text-white px-2 py-1 rounded-full text-xs">
  //                   {post.category?.name}
  //                 </span>
  //               </div>
  //             </div>
  //             <div className="p-4">
  //               <h3 className="font-semibold text-lg leading-tight group-hover:text-[#F05922] transition-colors line-clamp-2 mb-2">
  //                 {post.title}
  //               </h3>
  //               <p className="text-sm text-gray-600 line-clamp-3 mb-3">
  //                 {post.content ? post.content.substring(0, 120) + '...' : ''}
  //               </p>
  //               <div className="flex justify-between items-center text-xs text-gray-500">
  //                 <span>{new Date(post.createdAt).toLocaleDateString()}</span>
  //                 <span>{post.viewCount || 0} views</span>
  //               </div>
  //             </div>
  //           </div>
  //         </Link>
  //       ))}
  //     </div>
  //   </div>
  // );
};

  if (isLoading) {
    return (
      <div className="contain mx-auto px-6 md:px-12 py-20 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-gray-200 border-t-[#F05922] rounded-full animate-spin" aria-label="Loading"></div>
      </div>
    );
  }

  return (
    <div className="contain mx-auto px-6 md:px-12 py-6 ">
      {/* headnews  */}
      {headingNews.map((news, index) => (
        <div key={index} className="cursor-pointer" >
          <Link to={`/${(news.category?.slug || '').toLowerCase()}/${news._id}/${news.slug}`}>
            <h1 className="font-bold md:text-[50px] text-[22px] text-center mb-2 hover:text-[#F05922] ">{news.title}</h1>
            <div className="flex items-center justify-center mb-6 gap-2">
              {/* <div className="w-[38px] h-[38px] rounded-full p-[1.5px] bg-gradient-to-r from-[#0066B3] to-[#F05922]">
                <img
                  src={logo}
                  className="w-full h-full rounded-full bg-white p-[2px]"
                  alt="logo"
                />
              </div> */}
              {/* <p className="text-[16px] text-[#4e4e4e] font-medium">नवता न्यूज</p> */}
            </div>
            {/* <img src={news.img} alt={news.title} className="mb-20 w-full md:h-[650px]  md:object-cover h-[300px]" /> */}

            <img src={`${import.meta.env.VITE_SERVERAPIIMG}${news.image}`} alt={news.title} className="mb-20 w-full md:h-[650px]  md:object-cover h-[300px]" />
          </Link>
        </div>
      ))}
      
      {/* Main Featured Story */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Main Featured News */}
        {featuredNews.length > 0 && (
          <div className="lg:col-span-2 relative">
            <Link to={`/NewsDetails/${featuredNews[0]._id}/${featuredNews[0].slug}`}>
              <img
                src={`${import.meta.env.VITE_SERVERAPIIMG}${featuredNews[0].image}`}
                alt={featuredNews[0].title}
                className="rounded-lg w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-6">
                <span className="text-white bg-[#F05922] px-3 py-1 rounded-full text-sm">{featuredNews[0].category?.name}</span>
                <h1 className="md:text-3xl font-bold text-white mt-3 text-[22px]">
                  {featuredNews[0].title}
                </h1>
                {/* <p className="text-gray-200 mt-2">{featuredNews[0].content}</p> */}
              </div>
            </Link>
          </div>
        )}
        {/* Remaining Featured News - Sidebar */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold border-b-2 border-[#F05922] pb-2">Today's Main News</h2>
          <div className="space-y-4 mt-4">
            {featuredNews.slice(1).map((news, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex items-start">
                  <Link to={`/${(news.category?.slug || '').toLowerCase()}/${news._id}/${news.slug}`}>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-[#F05922] transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{news.category?.name}</p>
                    </div>
                  </Link>
                  <span className="text-xs text-gray-400 ml-2">
                    {/* {new Date(news.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} */}
                  </span>
                </div>
                {index !== featuredNews.length - 2 && <hr className="my-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Posts Section */}
      {renderRecommendedPosts()}

      {/* All Categories - 2 per line (excluding last 2) */}
      {allCategories.slice(0, -2).map((category, index) => {
        if (index % 2 === 0) {
          // Start new row - First category (oldest) on left, second category on right
          return (
            <div key={index} className="flex md:flex-row flex-col gap-10 h-fit mb-8">
              {renderCategorySection(category, index)}
              {allCategories.slice(0, -2)[index + 1] && renderCategoryListSection(allCategories.slice(0, -2)[index + 1], index + 1)}
            </div>
          );
        }
        return null; // Skip odd indices as they're handled in the previous iteration
      })}

      {/* Last 2 Categories with different UI layouts */}
      {allCategories.length >= 2 && (
        <>
          {/* Second to last category - 4-column horizontal layout */}
          {renderCategoryHorizontal4Layout(allCategories[allCategories.length - 2])}
          
          {/* Last category - 2-column main layout */}
          {renderCategory2ColumnLayout(allCategories[allCategories.length - 1])}
        </>
      )}

      {/* Entertainment and Health - Different UI */}
      {renderEntertainmentAndHealth()}
    </div>
  );
};

export default HomepageBody;