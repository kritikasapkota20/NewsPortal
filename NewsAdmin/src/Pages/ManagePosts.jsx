import { useEffect, useState } from "react"
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MdManageSearch } from "react-icons/md";

const ManagePosts = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pageByCategory, setPageByCategory] = useState({});
  const [totalPagesByCategory, setTotalPagesByCategory] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/post/admin/groupedPosts?limit=5");
      if (response.data.success) {
        const groupsData = response.data.groups || [];
        setGroups(groupsData);
        // initialize pagination maps
        const initPages = {};
        const initTotals = {};
        groupsData.forEach(g => {
          initPages[g.category.slug] = 1;
          initTotals[g.category.slug] = Math.max(1, Math.ceil((g.total || 0) / (g.limit || 5)));
        });
        setPageByCategory(initPages);
        setTotalPagesByCategory(initTotals);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching posts", error);
      setError("Failed to fetch post. Please try again later!");
      setLoading(false);
    }
  };

  const confirmDelete = (post) => {
    setSelectedPost(post);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    const { _id, category } = selectedPost;
    try {
      const response = await axios.delete(`http://localhost:5000/api/post/deletePost/${category}/${_id}`);
      if (response.status === 200) {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== _id));
      } else {
        console.log("Deletion failed:", response.data.message);
      }
    } catch (error) {
      console.log("Error deleting post:", error.response ? error.response.data : error.message);
    } finally {
      setShowConfirm(false);
      setSelectedPost(null);
    }
  };

  const fetchCategoryPage = async (categorySlug, page) => {
    try {
      const limit = 5;
      const url = `http://localhost:5000/api/post/getPostsByCategory/${categorySlug}?page=${page}&limit=${limit}`;
      const res = await axios.get(url);
      if (res.data.success) {
        setGroups(prev => prev.map(g => {
          if (g.category.slug === categorySlug) {
            return { ...g, posts: res.data.posts, page };
          }
          return g;
        }));
        setPageByCategory(prev => ({ ...prev, [categorySlug]: page }));
        // total pages may change if posts changed
        const totalPages = Math.max(1, Math.ceil((res.data.total || 0) / (res.data.limit || 5)));
        setTotalPagesByCategory(prev => ({ ...prev, [categorySlug]: totalPages }));
      }
    } catch (e) {
      console.error("Failed to fetch category page", e);
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
        <h1 className="text-2xl font-semibold text-gray-800">Manage Posts</h1>
      </div>
      
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">Do you really want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {groups.map((group) => {
        const { category, posts } = group;
        const currentPage = pageByCategory[category.slug] || 1;
        const totalPages = totalPagesByCategory[category.slug] || 1;
        const windowSize = 5;
        const startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
        const endPage = Math.min(totalPages, startPage + windowSize - 1);
        return (
          <div key={category._id} className="mb-8 bg-white rounded-xl shadow-md overflow-hidden min-w-fit">
            <h2 className="text-xl font-bold p-4 bg-gray-600 text-white">{category.name}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-max divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-600">Title</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-600">Image</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-600">Created Date</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-4 text-gray-900 w-[300px]">{post.title}</td>
                      <td className="px-4 py-4">
                        <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden">
                          {post.image ? (
                            <img src={`http://localhost:5000${post.image}`} alt={post.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500">{format(new Date(post.createdAt), "MMM d yyyy, h:mm a")}</td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <span className={`px-2 py-1 rounded text-xs ${
                          post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {post.status === 'published' ? 'Published' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link to={`/Admin/view-post/${post.category.name}/${post._id}`}>
                            <div className="relative group flex justify-center">
                              <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">View</span>
                              <button className="min-w-[30px] bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </div>
                          </Link>

                          <Link to={`/Admin/edit-post/${post.category.name}/${post._id}`}>
                            <div className="relative group flex justify-center">
                              <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Edit</span>
                              <button className="min-w-[30px] bg-secondary text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </Link>
                          <div className="relative group flex justify-center">
                            <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Delete</span>
                            <button
                              onClick={() => confirmDelete(post)}
                              className="min-w-[30px] bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination for this category */}
            <div className="flex gap-4 items-center p-4">
              {[...Array(endPage - startPage + 1)].map((_, idx) => {
                const pageNum = startPage + idx;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchCategoryPage(category.slug, pageNum)}
                    className={`px-4 py-2 rounded-full ${isActive ? 'bg-secondary text-white transition-transform hover:scale-95' : 'bg-orange-400 text-white hover:scale-95 transition-transform  '}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => fetchCategoryPage(category.slug, Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className={`px-5 py-2 rounded-full ${currentPage >= totalPages ? 'bg-orange-600 text-white hover:scale-95 transition-transform' : 'bg-orange-600 text-white hover:scale-95 transition-transform'}`}
              >
                NEXT
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManagePosts;