import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaCalendar, FaUser, FaTag, FaEye, FaArrowLeft } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { category, id } = useParams(); // Get URL parameters

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/post/getPosts");

      if (response.data.success) {
        const posts = response.data.posts;
        setPosts(posts);

        const categoryIds = [...new Set(posts.map(post => post.category?._id))];
        const uniqueCategories = categoryIds
          .map(id => posts.find(post => post.category?._id === id)?.category)
          .filter(Boolean);

        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Error fetching posts", err);
      setError("Failed to fetch posts. Please try again later.");
      toast.error("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/post/getPost/${id}`);
      
      if (response.data.success) {
        setSinglePost(response.data.post);
      } else {
        setError("Post not found");
        toast.error("Post not found");
      }
    } catch (err) {
      console.error("Error fetching post", err);
      setError("Failed to fetch post details");
      toast.error("Failed to fetch post details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If category and id are provided in URL, fetch single post
    if (category && id) {
      fetchSinglePost();
    } else {
      // Otherwise fetch all posts
      fetchPosts();
    }
  }, [category, id]);

  const handleDelete = async (id, categorySlug) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/post/deletePost/${categorySlug}/${id}`);
      
      if (singlePost) {
        // If viewing single post, go back to all posts
        alert("Post deleted successfully");
        navigate("/Admin/view-posts");
        toast.success("Post deleted successfully!");
      } else {
        // If viewing all posts, remove from list
        setPosts(prev => prev.filter(post => post._id !== id));
        alert("Post deleted successfully");
        toast.success("Post deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting post", error);
      const errorMessage = error.response?.data?.message || "Failed to delete the post.";
      alert(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (post) => {
    try {
      // Navigate to edit page
      navigate(`/Admin/edit-post/${category || post.category?.name}/${post._id}`);
      toast.info("Redirecting to edit page...");
    } catch (error) {
      console.error("Error navigating to edit page", error);
      alert("Failed to navigate to edit page");
      toast.error("Failed to navigate to edit page");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate("/Admin/view-posts")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  // If viewing a single post
  if (singlePost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/Admin/view-posts")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <FaArrowLeft /> Back to All Posts
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-2xl font-bold text-gray-900">Post Details</h1>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(singlePost)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <FaEdit /> Edit Post
                </button>
                <button
                  onClick={() => handleDelete(singlePost._id, singlePost.category?.slug)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Single Post Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Post Header */}
            <div className="
          
            p-6">
                {/* bg-gradient-to-r from-blue-600 to-purple-600 text-white  */}
              <h2 className="text-3xl font-bold mb-4 ">{singlePost.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  {formatDistanceToNow(new Date(singlePost.createdAt), { addSuffix: true })}
                </div>
                {singlePost.category && (
                  <div className="flex items-center gap-2">
                    <FaTag />
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {singlePost.category.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FaUser />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    singlePost.status === "published" 
                      ? "bg-green-500 bg-opacity-20"
                      : singlePost.status === "draft"
                      ? "bg-yellow-500 bg-opacity-20"
                      : singlePost.status === "pending_review"
                      ? "bg-orange-500 bg-opacity-20"
                      : singlePost.status === "rejected"
                      ? "bg-red-500 bg-opacity-20"
                      : "bg-gray-500 bg-opacity-20"
                  }`}>
                    {singlePost.status || "Published"}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-6">
              {/* Image */}
              {singlePost.image && (
                <div className="mb-6">
                  <img
                    src={`http://localhost:5000${singlePost.image}`}
                    alt={singlePost.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {singlePost.content}
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-blue-500" />
                    <span>Created: {new Date(singlePost.createdAt).toLocaleDateString()}</span>
                  </div>
                  {singlePost.updatedAt && singlePost.updatedAt !== singlePost.createdAt && (
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-green-500" />
                      <span>Updated: {new Date(singlePost.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaEye className="text-purple-500" />
                    <span>Post ID: {singlePost._id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }

  // If viewing all posts (original functionality)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">View All Posts</h1>
              <p className="text-gray-600 mt-1">Detailed view of all your published posts</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/Admin/create-post")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <FaEdit /> Create New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first post</p>
            <button
              onClick={() => navigate("/Admin/create-post")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Post Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaCalendar />
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </div>
                        {post.category && (
                          <div className="flex items-center gap-2">
                            <FaTag />
                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                              {post.category.name}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FaUser />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === "published" 
                              ? "bg-green-500 bg-opacity-20"
                              : post.status === "draft"
                              ? "bg-yellow-500 bg-opacity-20"
                              : post.status === "pending_review"
                              ? "bg-orange-500 bg-opacity-20"
                              : post.status === "rejected"
                              ? "bg-red-500 bg-opacity-20"
                              : "bg-gray-500 bg-opacity-20"
                          }`}>
                            {post.status || "Published"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id, post.category?.slug)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Image */}
                  {post.image && (
                    <div className="mb-6">
                      <img
                        src={`http://localhost:5000${post.image}`}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-blue-500" />
                        <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      {post.updatedAt && post.updatedAt !== post.createdAt && (
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-green-500" />
                          <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FaEye className="text-purple-500" />
                        <span>Post ID: {post._id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ViewPosts;
