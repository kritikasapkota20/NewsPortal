import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosCreate } from "react-icons/io";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategory: "",
    content: "",
    image: "",
    isHeadNews: false,
    isMainNews: false,
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subCategory", formData.subCategory);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("file", formData.image);
    formDataToSend.append("isHeadNews", formData.isHeadNews);
    formDataToSend.append("isMainNews", formData.isMainNews);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/post/createPost",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        alert("Post created successfully");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const selectedCategory = categories.find((c) => c._id === formData.category);
  const hasSubCategories = selectedCategory?.subCategories?.length > 0;

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl w-full">
        <IoIosCreate className="text-primary text-2xl" />
        <h1 className="text-2xl font-semibold text-gray-800">Create Post</h1>
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
              required
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
            required
          />
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
        

        <div>
          <button className="text-white px-6 py-2 rounded-lg bg-primary hover:bg-primaryHover">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
