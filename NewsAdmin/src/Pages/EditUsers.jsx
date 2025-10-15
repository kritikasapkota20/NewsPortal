import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosCreate } from "react-icons/io";

const EditPost = () => {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        content: "",
        image: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { id, category } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);
                // First try to get all posts and find the specific one
                const res = await axios.get("http://localhost:5000/api/post/getPosts");
                
                if (res.data.success) {
                    const post = res.data.posts.find(p => p._id === id && p.category === category);
                    if (post) {
                        setFormData({
                            title: post.title,
                            category: post.category,
                            content: post.content,
                            image: null,
                        });
                    } else {
                        setError("Post not found");
                    }
                } else {
                    setError("Failed to fetch post details");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                const errorMessage = error.response?.data?.message || "Failed to fetch post. Please try again later.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("content", formData.content);
            if (formData.image) {
                formDataToSend.append("file", formData.image);
            }

            const response = await axios.patch(
                `http://localhost:5000/api/post/editPost/${category}/${id}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Post updated successfull");
                setTimeout(() => navigate("/Admin/manage-posts"), 2000);
            } else {
                const errorMessage = response.data.message || "Failed to update post";
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Error updating post:", error);
            const errorMessage = error.response?.data?.message || "Failed to update post. Please try again.";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0065B3]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <button 
                        onClick={() => navigate("/Admin/manage-posts")}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Back to Posts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='p-6 flex flex-col items-center'>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl w-full">
                <IoIosCreate className="text-[#0065B3] text-2xl" />
                <h1 className="text-2xl font-semibold text-gray-800">Edit Post</h1>
            </div>
            <form onSubmit={handleSubmit} className='max-w-2xl bg-white p-6 rounded-lg shadow-2xl w-full'>
                <div className='mb-4'>
                    <label className='block text-base font-bold text-gray-700 mb-2'>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-base font-bold mb-2'>Category:</label>
                    <select 
                        name='category' 
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]'
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Category</option>
                        <option value="News">समाचार</option>
                        <option value="Economy">अर्थ</option>
                        <option value="Bichar">बिचार</option>
                        <option value="Health">स्वास्थ्य</option>
                        <option value="Entertainment">मनोरञ्जन</option>
                        <option value="Education">शिक्षा</option>
                        <option value="Sports">खेलकुद</option>
                        <option value="Feature">फिचर</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-base font-bold mb-2'>Content:</label>
                    <textarea 
                        name='content'
                        rows={10}
                        value={formData.content}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]'
                        required
                    ></textarea>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-base font-bold mb-2'>Image:</label>
                    <input 
                        type='file'
                        onChange={handleImageChange}
                        className='w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]'
                    />
                </div>
                <div className="flex gap-4">
                    <button 
                        type="button"
                        onClick={() => navigate("/Admin/manage-posts")}
                        className="w-1/3 bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={submitting}
                        className={`w-2/3 bg-[#F05922] text-white px-6 py-2 rounded-lg transition-colors duration-300 ${
                            submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0065B3]'
                        }`}
                    >
                        {submitting ? 'Updating...' : 'Update Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;