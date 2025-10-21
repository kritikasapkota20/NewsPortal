import React, { useEffect, useState } from "react";
import axios from "axios";
import { ImUsers } from "react-icons/im";
import { FiTrash2 } from "react-icons/fi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVERAPI || "http://localhost:5000/api"}/user/getUsers`,
          { withCredentials: true }
        );
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Secure Role Change Function
  const handleRoleChange = async (userId, newRole) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    if (newRole === user.role) return; // no change

    const confirmed = window.confirm(
      `Are you sure you want to change ${user.username}'s role from ${user.role} to ${newRole}?`
    );
    if (!confirmed) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVERAPI || "http://localhost:5000/api"}/user/updateRole/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );

      alert("Role updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  // Delete User
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/user/delete/${userId}`,
        { withCredentials: true }
      );
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
        <ImUsers className="text-[#0065B3] text-2xl" />
        <h1 className="text-2xl font-semibold text-gray-800">Manage Users</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role || "User"}
                  </td>
                 

<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {new Date(user.lastLogin).toLocaleDateString()}
</td>


                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      {/* Role Dropdown */}
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition"
                      >
                        <option value="User">User</option>
                        <option value="Editor">Editor</option>
                        
                      </select>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-all duration-200"
                        title="Delete User"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
