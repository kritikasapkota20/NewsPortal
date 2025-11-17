import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import UseDate from './UseDate';
import { BsClock } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBookmark, FaRegBookmark, FaEdit, FaTrash, FaReply } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticleRecommendations from './ArticleRecommendations';
import { recordPostView } from '../utils/viewTracker';

// Comment Edit Form Component
const CommentEditForm = ({ comment, onSave, onCancel }) => {
  const [editText, setEditText] = useState(comment.text);

  return (
    <div className="mt-2">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows="3"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSave(editText)}
          className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Most Read Section Component
const MostReadSection = ({ categorySlug }) => {
  const [mostReadPosts, setMostReadPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostRead = async () => {
      try {
        setLoading(true);
        const url = categorySlug
          ? `${import.meta.env.VITE_SERVERAPI}/post/most-read/${categorySlug}?limit=5`
          : `${import.meta.env.VITE_SERVERAPI}/post/most-read/all?limit=5`;
        const res = await axios.get(url);
        setMostReadPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching most read posts:", error);
        setMostReadPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMostRead();
  }, [categorySlug]);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading...</div>;
  }

  if (mostReadPosts.length === 0) {
    return <div className="text-center py-4 text-gray-500">No posts found</div>;
  }

  return (
    <div>
      {mostReadPosts.map((item) => (
        <div key={item._id} className="flex gap-4 items-center py-3 border-b last:border-b-0">
          <img
            src={item.image?.startsWith("http") ? item.image : `http://localhost:5000${item.image}`}
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
  );
};

const Samachardetails = ({data}) => {
  const { id } = useParams(); // assuming the URL is like /samacharDetails/:id
  const { nepaliDate } = UseDate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const navigate = useNavigate();
// Fetch auth status
useEffect(() => {
  const fetchAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/user/getUser`, { withCredentials: true });
      setAuth({ authenticated: !!res.data?.authenticated, user: res.data?.user || null });
    } catch {
      setAuth({ authenticated: false, user: null });
    }
  };
  fetchAuth();
}, []);

// Check bookmark status
useEffect(() => {
  const checkBookmark = async () => {
    if (auth.authenticated && post?._id) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/bookmarks/check/${post._id}`,
          { withCredentials: true }
        );
        setIsBookmarked(res.data.isBookmarked);
      } catch (err) {
        // Not bookmarked or not logged in
        setIsBookmarked(false);
      }
    }
  };
  checkBookmark();
}, [auth.authenticated, post?._id]);

// Toggle bookmark
const handleBookmark = async () => {
  if (!auth.authenticated) {
    toast.error("Please login to bookmark posts");
    setTimeout(() => navigate("/AuthForm"), 1500);
    return;
  }

  try {
    if (isBookmarked) {
      await axios.delete(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/bookmarks/${post._id}`,
        { withCredentials: true }
      );
      setIsBookmarked(false);
      toast.success("Bookmark removed");
    } else {
      await axios.post(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/bookmarks/${post._id}`,
        {},
        { withCredentials: true }
      );
      setIsBookmarked(true);
      toast.success("Post bookmarked");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update bookmark");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!auth.authenticated) {
    toast.error("Please login to post a comment.");
    setTimeout(() => navigate("/AuthForm"), 1500);
    return;
  }

  try {
    const { data: newComment } = await axios.post(
      `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,
      { text: comment, parentCommentId: replyingToId || null },
      { withCredentials: true }
    );

    // Refresh comments
    const { data: updatedComments } = await axios.get(
      `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,
      { withCredentials: true }
    );
    setComments(updatedComments);
    setComment("");
    setReplyingToId(null);
    toast.success("Comment posted successfully");
  } catch (error) {
    console.error("Error posting comment:", error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      toast.error("Please login to post a comment.");
      setTimeout(() => navigate("/AuthForm"), 1500);
    } else {
      toast.error(error.response?.data?.message || "Failed to post comment. Please try again later.");
    }
  }
};

// Handle reply
const handleReply = async (parentId) => {
  if (!auth.authenticated) {
    toast.error("Please login to reply");
    setTimeout(() => navigate("/AuthForm"), 1500);
    return;
  }

  if (!replyText.trim()) {
    toast.error("Reply cannot be empty");
    return;
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,
      { text: replyText, parentCommentId: parentId },
      { withCredentials: true }
    );

    const { data: updatedComments } = await axios.get(
      `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,
      { withCredentials: true }
    );
    setComments(updatedComments);
    setReplyText("");
    setReplyingToId(null);
    toast.success("Reply posted successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to post reply");
  }
};

// Handle edit comment
const handleEditComment = async (commentId, newText) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_SERVERAPI}/comments/${commentId}`,
      { text: newText },
      { withCredentials: true }
    );

    const { data: updatedComments } = await axios.get(
      `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,
      { withCredentials: true }
    );
    setComments(updatedComments);
    setEditingCommentId(null);
    toast.success("Comment updated successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update comment");
  }
};

// Handle delete comment
const handleDeleteComment = async (commentId) => {
  if (!window.confirm("Are you sure you want to delete this comment?")) return;

  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVERAPI}/comments/${commentId}`,
      { withCredentials: true }
    );

    const { data: updatedComments } = await axios.get(
      `${import.meta.env.VITE_SERVERAPI}/comments/${post._id}`,
      { withCredentials: true }
    );
    setComments(updatedComments);
    toast.success("Comment deleted successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete comment");
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
        // Use the new API endpoint that includes editor name
        const res = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPost/${id}`);
        const found = res.data.post;
        setPost(found || null);

        // Fetch related posts
        const allPostsRes = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`);
        const allPosts = allPostsRes.data.posts;
        const related = allPosts.filter(
          (item) => item._id !== id && item.category?.slug === found?.category?.slug
        );
        setRelatedPosts(related.slice(0, 5));

        // Fetch most read posts
        if (found?.category?.slug) {
          try {
            const mostReadRes = await axios.get(
              `${import.meta.env.VITE_SERVERAPI}/post/most-read/${found.category.slug}?limit=5`
            );
            setRelatedPosts(prev => [...prev, ...mostReadRes.data.posts.slice(0, 5)]);
          } catch (err) {
            console.error("Error fetching most read:", err);
          }
        }
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

  useEffect(() => {
    if (post?._id) {
      try { recordPostView(post); } catch(_) {}
    }
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

          <div className="flex mb-4 gap-4 items-center text-sm text-[#3f3d3d]">
            <div className="flex gap-2 items-center">
              <BsClock />
              <p className="m-0">{new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
            </div>
            {post.assignedEditor && (
              <div className="flex gap-2 items-center">
                <FaUserCircle />
                <p className="m-0">Editor: {post.assignedEditor.username || "Unknown"}</p>
              </div>
            )}
            {auth.authenticated && (
              <button
                onClick={handleBookmark}
                className="ml-auto flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
              >
                {isBookmarked ? (
                  <><FaBookmark className="text-[#F05922]" /> <span className="text-xs">Bookmarked</span></>
                ) : (
                  <><FaRegBookmark /> <span className="text-xs">Bookmark</span></>
                )}
              </button>
            )}
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
  {replyingToId && (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm text-gray-600 mb-2">Replying to comment...</p>
      <textarea
        rows="2"
        placeholder="Write your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-700"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => {
            setReplyingToId(null);
            setReplyText("");
          }}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={() => handleReply(replyingToId)}
          className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
        >
          Post Reply
        </button>
      </div>
    </div>
  )}

  <form onSubmit={handleSubmit} className="mb-8">
    <textarea
      required
      rows="3"
      placeholder={auth.authenticated ? "Write your comment..." : "Please login to comment"}
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      disabled={!auth.authenticated}
      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none text-gray-700 disabled:bg-gray-100"
    />

    <div className="flex justify-end mt-3">
      <button
        className="bg-[#F05922] text-white py-2 px-5 rounded-lg hover:bg-[#d94f1f] transition font-semibold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        type="submit"
        disabled={!auth.authenticated}
      >
        Post Comment
      </button>
    </div>
  </form>

  {/* 💬 Show existing comments */}
  <div className="space-y-5">
    {comments.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
    ) : (
      comments.map((c) => {
        const commentUserId = typeof c.userId === 'object' ? c.userId?._id : c.userId;
        const currentUserId = auth.user?._id || auth.user?.id;
        const isOwner = auth.user && commentUserId && currentUserId && String(commentUserId) === String(currentUserId);
        const isEditing = editingCommentId === c._id;

        return (
          <motion.div
            key={c._id}
            className="border border-gray-200 bg-gray-50 rounded-xl p-4 hover:shadow-sm transition"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className='flex gap-2 items-center'>
                <FaUserCircle className='text-3xl text-gray-500' />
                <div>
                  <p className="font-semibold text-gray-800">
                    {c.userId?.username || "Anonymous"}
                  </p>
                  {c.isEdited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                {isOwner && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingCommentId(isEditing ? null : c._id)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit comment"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete comment"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <CommentEditForm
                comment={c}
                onSave={(newText) => {
                  handleEditComment(c._id, newText);
                }}
                onCancel={() => setEditingCommentId(null)}
              />
            ) : (
              <>
                <p className="text-gray-700 leading-relaxed mb-2">{c.text}</p>
                {auth.authenticated && !isOwner && (
                  <button
                    onClick={() => setReplyingToId(c._id)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <FaReply /> Reply
                  </button>
                )}
              </>
            )}

            {/* Replies */}
            {c.replies && c.replies.length > 0 && (
              <div className="mt-3 ml-6 space-y-3 border-l-2 border-gray-300 pl-4">
                {c.replies.map((reply) => {
                  const replyUserId = typeof reply.userId === 'object' ? reply.userId?._id : reply.userId;
                  const currentUserId = auth.user?._id || auth.user?.id;
                  const isReplyOwner = auth.user && replyUserId && currentUserId && String(replyUserId) === String(currentUserId);
                  return (
                    <div key={reply._id} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex gap-2 items-center">
                          <FaUserCircle className="text-xl text-gray-400" />
                          <p className="font-semibold text-sm text-gray-700">
                            {reply.userId?.username || "Anonymous"}
                          </p>
                          {reply.isEdited && (
                            <span className="text-xs text-gray-400">(edited)</span>
                          )}
                        </div>
                        {isReplyOwner && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDeleteComment(reply._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete reply"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{reply.text}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })
    )}
  </div>
</motion.div>

          {/* Article Recommendations Section */}
          {post?._id && (
            <ArticleRecommendations 
              articleId={post._id} 
              title="You might also like"
            />
          )}
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
            <MostReadSection categorySlug={post?.category?.slug} />

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
