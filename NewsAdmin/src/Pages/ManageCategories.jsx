import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // Default: descending

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/categories`);
      if (response.data && Array.isArray(response.data.categories)) {
        const sorted = [...response.data.categories].sort((a, b) => {
          return sortOrder === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        });
        setCategories(sorted);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [sortOrder]);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_SERVERAPI}/categories`, {
          name: newCategory,
          description: newDescription.trim() || null,
        });
        setNewCategory("");
        setNewDescription("");
        setShowAdd(false);
        fetchCategories(); // refresh with correct sort
      } catch (err) {
        console.error("Error adding category:", err);
      }
    }
  };

  const handleEditCategory = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVERAPI}/categories/${id}`, {
        name: editName,
      });
      const updated = categories.map((cat) =>
        cat._id === id ? response.data.category : cat
      );
      const sorted = [...updated].sort((a, b) => {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      });
      setCategories(sorted);
      setEditId(null);
      setEditName("");
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVERAPI}/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#0065B3]">Manage Categories</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-gray-200  text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
            {/* <IoIosArrowDown /> */}
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 bg-[#F05922] text-white px-4 py-2 rounded-lg hover:bg-[#0065B3] transition"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Add Category Section */}
      {showAdd && (
        <div className="mb-6 bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter description (optional)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
          />
          <button
            onClick={handleAddCategory}
            className="bg-[#0065B3] text-white px-4 py-2 rounded-lg hover:bg-[#F05922] transition"
          >
            Add
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F7F8FA]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editId === cat._id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    <span className="font-medium text-gray-800">{cat.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {format(new Date(cat.createdAt), "MMM dd yyyy, h:mm a")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3 justify-center">
                  {editId === cat._id ? (
                    <button
                      onClick={() => handleEditCategory(cat._id)}
                      className="bg-[#0065B3] text-white px-3 py-1 rounded hover:bg-[#F05922] transition"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(cat._id);
                          setEditName(cat.name);
                        }}
                        className="text-[#0065B3] hover:text-[#F05922] transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      {showConfirm && deletedId === cat._id && (
                        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h3>
                            <p className="text-gray-600 mb-6">Do you really want to delete this category?</p>
                            <div className="flex justify-center gap-4">
                              <button
                                onClick={() => {
                                  setShowConfirm(false);
                                  setDeletedId(null);
                                }}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteCategory(cat._id);
                                  setShowConfirm(false);
                                }}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                              >
                                Yes, Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setDeletedId(cat._id);
                          setShowConfirm(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                      <Link to={`/admin/manage-posts/`}>
                        <button
                          className="text-green-600 hover:text-green-800 transition"
                          title="View Posts"
                        >
                          <FaEye />
                        </button>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
