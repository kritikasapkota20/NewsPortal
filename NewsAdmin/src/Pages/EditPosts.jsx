import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosCreate } from "react-icons/io";

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategory: "",
    content: "",
    image: null,
    isHeadNews: false,
    isMainNews: false,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id, category } = useParams();

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        if (response.data.success) {
          setCategories(response.data.categories || []);
        }
        console.log("Fetched categories:", response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch the post details based on id and category string from URL
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/post/getPosts");

        if (res.data.success) {
          // Find post where _id matches AND category._id matches URL category param or category name matches
          const post = res.data.posts.find(
            (p) =>
              p._id === id &&
              (p.category._id === category || p.category.name === category)
          );

          if (post) {
            setFormData({
              title: post.title,
              category: post.category._id, // store category ID
              subCategory: post.subCategory || "",
              content: post.content,
              image: null,
              isHeadNews: post.isHeadNews || false,
              isMainNews: post.isMainNews || false,
            });
          } else {
            setError("Post not found");
          }
        } else {
          setError("Failed to fetch post details");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch post. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
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
      if (formData.subCategory) {
        formDataToSend.append("subCategory", formData.subCategory);
      }
      formDataToSend.append("content", formData.content);
      if (formData.image) {
        formDataToSend.append("file", formData.image);
      }
      formDataToSend.append("isHeadNews", formData.isHeadNews);
      formDataToSend.append("isMainNews", formData.isMainNews);

      const response = await axios.patch(
        `http://localhost:5000/api/post/editPost/${formData.category}/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Post updated successfully");
        navigate("/admin/dashboard");
      } else {
        const errorMessage = response.data.message || "Failed to update post";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update post. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            onClick={() => navigate("/admin/dashboard")}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selectedCategory = categories.find((c) => c._id === formData.category);
  const hasSubCategories = selectedCategory?.subCategories?.length > 0;

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl w-full">
        <IoIosCreate className="text-primary text-2xl" />
        <h1 className="text-2xl font-semibold text-gray-800">Edit Post</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white p-6 rounded-lg shadow-2xl w-full"
      >
        <div className="mb-4">
          <label className="block text-base font-bold text-gray-700 mb-2">
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Category:
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              handleChange(e);
              setFormData((prev) => ({ ...prev, subCategory: "" })); // reset subCategory
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {hasSubCategories && (
          <div className="mb-4">
            <label className="block text-gray-700 text-base font-bold mb-2">
              Sub Category:
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Sub Category</option>
              {selectedCategory.subCategories.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Content:
          </label>
          <textarea
            name="content"
            rows={10}
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Image:
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to keep the current image
          </p>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="block text-gray-700 text-base font-bold mb-2">
            <input
              type="checkbox"
              name="isHeadNews"
              checked={formData.isHeadNews}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isHeadNews: e.target.checked,
                }))
              }
              className="mr-2"
            />
            Mark as Head News
          </label>
          <label className="block text-gray-700 text-base font-bold mb-2">
            <input
              type="checkbox"
              name="isMainNews"
              checked={formData.isMainNews}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isMainNews: e.target.checked,
                }))
              }
              className="mr-2"
            />
            Mark as Featured News
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="w-1/3 bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`w-2/3 text-white px-6 py-2 rounded-lg transition-colors duration-300 ${
              submitting 
                ? "opacity-50 cursor-not-allowed bg-gray-400" 
                : "bg-primary hover:bg-primaryHover"
            }`}
          >
            {submitting ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
