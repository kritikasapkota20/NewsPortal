import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MdManageSearch } from "react-icons/md";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showConfirm,setShowConfirm]=useState(false);
  useEffect(() => {
    fetchPosts();
  }, [])
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/post/getPosts");
      if (response.data.success) {
        setPosts(response.data.posts)
      }
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.log("Error fetching posts", error);
      setError("Failed to fetch post. Please try again later!");
      setLoading(false);
    }
  }
  const confirmDelete = (post) => {
    setSelectedPost(post);
    setShowConfirm(true);
  };
  const handleDeleteConfirmed = async () => {
    // const confirmMsg = window.confirm("Are you sure you want to delete this post?");
    // if (confirmMsg) {
    const {_id,category}=selectedPost;
      try {
        const response = await axios.delete(`http://localhost:5000/api/post/deletePost/${category}/${_id}`);
        console.log("Delete Response:", response.data);
        if (response.status === 200) {
          setPosts(prevPosts => prevPosts.filter(post => post._id !== _id));
        } else {
          console.log("Deletion failed:", response.data.message);
        }
      } catch (error) {
        console.log("Error deleting post:", error.response ? error.response.data : error.message);
      }finally{
        setShowConfirm(false);
        setSelectedPost(null);
      }
    // }
  };
  const categoryOrder = ['News', 'Economy', 'Bichar', 'Health', 'Entertainment', 'Education', 'Sports', 'Feature'];
  const commonStyle = "bg-gray-600 text-white";
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
  const postsByCategory = {};
  posts.forEach((post) => {
    if (!postsByCategory[post.category]) {
      postsByCategory[post.category] = [];
    }
    postsByCategory[post.category].push(post);
  })
  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
        <MdManageSearch className="text-primarytext-2xl" />
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
      {categoryOrder.map((category, index) => {
        const categoryPosts = postsByCategory[category] || [];
        if (!categoryPosts.length) return null;
        return (
          <div key={index} className="mb-8 bg-white rounded-xl shadow-md overflow-hidden min-w-fit">
            <h2 className={`text-xl font-bold p-4 ${commonStyle}`}>{category}</h2>
            <div className="overflow-x-auto ">
              <table className=" min-w-max divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Image</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Created Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divided-y divide-gray-100">
                  {categoryPosts.map((post) => {
                    return (
                      <tr key={post._id} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-6 py-4 text-gray-900 w-[300px]">{post.title}</td>
                        <td className="px-6 py-4">
                          <div className="pxh-16 w-16 rounded-lg bg-gray overflow-hidden">
                            {post.image ? (
                              <img src={`http://localhost:5000${post.image}`} alt={post.title} className="h-full w-full object-cover" />
                            ) : (<div className="h-full w-full flex items-center justify-content text-gray-400">No Image</div>)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{format(new Date(post.createdAt), "MMM d,yyyy")}</td>
                        <td className="px-6 py-4 text-sm font-medium space-x-3 ">
                          <button className="bg-red-500  text-white px-4 py-1.5 rounded-md  ">Pending</button>
                          {/* <button className="bg-green-500  text-white px-4 py-1.5 rounded-md  ">Published</button> */}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="inline-flex items-center space-x-2">
                            <Link to={`/Admin/edit-post/${post.category}/${post._id}`}> <button className="hover:bg-primary text-white px-4 py-1.5 rounded-md bg-secondary">View Details</button></Link>

                            <Link to={`/Admin/edit-post/${post.category}/${post._id}`}> <button className="bg-primary text-white px-4 py-1.5 rounded-md hover:bg-secondary">Edit</button></Link>
                            <button className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600" onClick={() => confirmDelete(post)}>Delete</button>

                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )

}
export default ManagePosts