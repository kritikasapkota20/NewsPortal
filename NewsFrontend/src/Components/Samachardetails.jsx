import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import UseDate from './UseDate';
import { BsClock } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Samachardetails = ({data}) => {
  const { id } = useParams(); // assuming the URL is like /samacharDetails/:id
  const { nepaliDate } = UseDate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  // const [isAuthenticated,setIsAuthenticated]=useState(false);
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data: newComment } = await axios.post(
      `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,
      { text: comment },
      { withCredentials: true }
    );

    setComments((prev) => [newComment, ...prev]);
    setComment("");
  } catch (error) {
    console.error("Error posting comment:", error);

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      toast.error("Please login to post a comment.");

      // ⏳ Give toast a moment to appear before navigating
      setTimeout(() => navigate("/AuthForm"), 1500);
    } else {
      toast.error("Failed to post comment. Please try again later.");
    }
  }
};



  // for fetching comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,  { withCredentials: true }
        );
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };
    if (post?._id) fetchComments();
  }, [post]);



  useEffect(() => {
    window.scrollTo(0, 0);

    // If data is passed as prop, use it directly
    if (data) {
      setPost(data);
      // Fetch related posts for the sidebar
      fetchRelatedPosts(data);
      return;
    }

    // Fallback to fetching data if no prop is passed
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`)
        const posts = res.data.posts;


        const found = posts.find((item) => item._id === id);
        console.log("Found post:", found);
        setPost(found || null);

        const related = posts.filter(
          (item) => item._id !== id && item.category?.slug === found?.category?.slug
        );
        setRelatedPosts(related.slice(0, 5));
      } catch (error) {
        console.error("Error fetching post details", error);
      }
    };

    fetchPost();
  }, [id, data]);
  useEffect(() => {
    if (!post || !post.category) return;

    const postCategoryId = post.category;

    const data = localStorage.getItem("viewedCategories");
    let viewedCategories = data ? JSON.parse(data) : {};

    viewedCategories[postCategoryId] = (viewedCategories[postCategoryId] || 0) + 1;

    localStorage.setItem("viewedCategories", JSON.stringify(viewedCategories));
  }, [post]);

  const fetchRelatedPosts = async (currentPost) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`);
      const posts = res.data.posts;


      const related = posts.filter(
        (item) => item._id !== currentPost._id && item.category?.slug === currentPost?.category?.slug
      );
      setRelatedPosts(related.slice(0, 5));
    } catch (error) {
      console.error("Error fetching related posts", error);
    }
  };

  if (!post) {
    return <div className="text-center py-10 text-gray-500">News item not found.</div>;
  }

  return (
    <div className="px-6 md:px-12 py-6">
      {/* Section Header */}
      <div className="px-4 py-2 mb-6 inline-block bg-[#F05922]">
        <h2 className="text-xl text-white font-bold">{post.category?.name}</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-7">
        {/* Main News */}
        <div className="lg:w-7/12 w-full">
          <h1 className="text-3xl lg:text-[34px] font-bold mb-7">{post.title}</h1>

          <div className="flex mb-4 gap-2 items-center text-sm text-[#3f3d3d]">
            <BsClock />
            <p className="m-0">{new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>

          <img
            src={post.image.startsWith("http") ? post.image : `http://localhost:5000${post.image}`}
            alt={post.title}
            className="w-full mb-6 object-cover"
          />

          <div className="py-2 text-base text-[#2A2A2A] text-justify">
            {post.content?.split("\n\n").map((paragraph, i) => (
              <React.Fragment key={i}>
                <p className='leading-relaxed whitespace-pre-wrap'>{paragraph}</p>
                <br />
              </React.Fragment>
            ))}
          </div>

    {/* 🗨️ Comment Section */}
<motion.div
  className="bg-white shadow-md w-full p-6 border border-gray-200 rounded-2xl mt-10"
  whileHover={{ scale: 1.01 }}
>
  <h3 className="text-2xl font-bold mb-4 text-gray-800">Comments</h3>

  {/* 🧾 Comment Count or Empty State */}
  <p className="text-gray-600 mb-6 border-b border-gray-300 pb-3">
    {comments.length > 0
      ? `${comments.length} ${comments.length === 1 ? "Comment" : "Comments"}`
      : "No comments yet — be the first to share your thoughts!"}
  </p>

  {/* 📝 Comment Form */}
  <form onSubmit={handleSubmit} className="mb-8">
    <textarea
      required
      rows="3"
      placeholder="Write your comment..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none text-gray-700"
    />

    <div className="flex justify-end mt-3">
      <button
        className="bg-[#F05922] text-white py-2 px-5 rounded-lg hover:bg-[#d94f1f] transition font-semibold shadow-md"
        type="submit"
      >
        Post Comment
      </button>
    </div>
  </form>

  {/* 💬 Show existing comments */}
  <div className="space-y-5">
    {comments.map((c) => (
      <motion.div
        key={c._id}
        className="border border-gray-200 bg-gray-50 rounded-xl p-4 hover:shadow-sm transition"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className='flex mb-1 gap-2 items-center'>
            <FaUserCircle className='text-3xl text-gray-500' />

          <p className="font-semibold text-gray-800">
            {c.userId?.username || "Anonymous"}
          </p>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}

          </span>
        </div>
        <p className="text-gray-700 leading-relaxed ">{c.text}</p>
      </motion.div>
    ))}
  </div>
</motion.div>
</div>

        {/* Sidebar Related News */}
        <div className="lg:w-5/12 w-full max-h-fit py-2 px-4">
          <motion.div className='bg-white shadow-2xl py-2 px-4 border-t-2 border-[#f3e7e7]'

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

            {relatedPosts.map((item, i) => (
              <div key={i} className="mb-4">
                <motion.div className="flex gap-4 items-center" whileHover={{ scale: 1.02 }}>
                  <img
                    src={item.image.startsWith("http") ? item.image : `http://localhost:5000${item.image}`}
                    className="w-[90px] h-[60px] object-cover"
                    alt={item.title}
                  />
                  <div>
                    <Link to={`/${(item.category?.slug || '').toLowerCase()}/${item._id}/${item.slug}`}>
                      <p className="cursor-pointer hover:text-secondary text-sm lg:text-[15px] font-semibold">
                        {item.title}
                      </p>
                    </Link>
                  </div>
                </motion.div>
                <p className="text-[#424040] text-xs lg:text-[13px] text-right mt-1">
                  {new Date(item.createdAt).toLocaleDateString("ne-NP")}
                </p>
                <div className="border border-[#e1dede] mt-2"></div>
              </div>
            ))}

          </motion.div>
          <div className='py-10'>
            <div className=" bg-[#f4eae7] px-4 py-2 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary inline-block"></span>
              <span className="uppercase text-secondary font-bold tracking-wide text-lg">Most Read</span>
            </div>
            <div>
              {relatedPosts.slice(0, 5).map((item, i) => (
                <div key={i} className="flex gap-4 items-center py-3 border-b last:border-b-0">
                  <img
                    src={item.image.startsWith("http") ? item.image : `http://localhost:5000${item.image}`}
                    className="w-[70px] h-[55px] object-cover rounded"
                    alt={item.title}
                  />
                  <Link to={`/${(item.category?.slug || '').toLowerCase()}/${item._id}/${item.slug}`}>
                    <p className="font-semibold text-[15px] hover:text-[#2170b8] transition-colors">
                      {item.title}
                    </p>
                  </Link>
                </div>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-7 mt-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h2>
              <p className="mb-5 text-base">
                Subscribe to Onlinekhabar English to get notified of exclusive news stories.
              </p>
              <form className="flex flex-col gap-3">
                <div className="flex items-center bg-white rounded px-3 py-2">
                  <span className="mr-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-secondary hover:bg-[#ef5218] text-white font-semibold py-2 rounded transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Samachardetails;
