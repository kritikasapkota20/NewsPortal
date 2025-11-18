import { useEffect, useState } from "react"
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MdManageSearch } from "react-icons/md";

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const ReviewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/posts/pending`, { withCredentials: true });
      if (response.data.posts) {
        setPosts(response.data.posts);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching pending posts", error);
      setError("Failed to fetch pending posts. Please try again later!");
      setLoading(false);
    }
  };

  const approvePost = async (postId) => {
    try {
      await axios.patch(`${API}/admin/posts/${postId}/approve`, {}, { withCredentials: true });
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (error) {
      console.log("Error approving post:", error);
    }
  };

  const rejectPost = async (postId) => {
    try {
      await axios.patch(`${API}/admin/posts/${postId}/reject`, {}, { withCredentials: true });
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (error) {
      console.log("Error rejecting post:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0065B3]"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-6 bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  return (
    <div className="py-6 px-0 lg:mx-auto max-w-7xl lg:max-w-5xl">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
        <MdManageSearch className="text-primary text-2xl" />
        <h1 className="text-2xl font-semibold text-gray-800">Review Posts</h1>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No posts pending review</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-max divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-600">Editor</th>
                  {/* <th className="px-4 py-4 text-left font-semibold text-gray-600">Created Date</th> */}
                  <th className="px-4 py-4 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-4 text-gray-900 w-[250px]">{post.title}</td>
                    <td className="px-4 py-4 text-gray-600">{post.category?.name}</td>
                    <td className="px-4 py-4 text-gray-600">{post.assignedEditor?.username}</td>
                    {/* <td className="px-4 py-4 text-gray-500">{format(new Date(post.createdAt), "MMM d yyyy, h:mm a")}</td> */}
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700">
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link to={`/Admin/view-post/${post.category.name}/${post._id}`}>
                          <button className="min-w-[30px] bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Link>
                        <button
                          onClick={() => approvePost(post._id)}
                          className="min-w-[30px] bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => rejectPost(post._id)}
                          className="min-w-[30px] bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPosts;
