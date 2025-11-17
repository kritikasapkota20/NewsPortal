import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaBookmark, FaEdit, FaLock, FaSignOutAlt } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchBookmarks();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/user/profile`,
        { withCredentials: true }
      );
      setUser(res.data.user);
      setFormData({
        username: res.data.user.username,
        email: res.data.user.email,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to view profile');
        navigate('/AuthForm');
      } else {
        toast.error('Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/bookmarks`,
        { withCredentials: true }
      );
      setBookmarks(res.data.bookmarks || []);
    } catch (error) {
      // User not logged in or no bookmarks
      setBookmarks([]);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/user/profile`,
        formData,
        { withCredentials: true }
      );
      setUser(res.data.user);
      setShowEditForm(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/user/change-password`,
        passwordData,
        { withCredentials: true }
      );
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleRemoveBookmark = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'}/bookmarks/${postId}`,
        { withCredentials: true }
      );
      setBookmarks(bookmarks.filter(b => b.postId._id !== postId));
      toast.success('Bookmark removed');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F05922]"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
            <Link to="/AuthForm" className="text-[#F05922] hover:underline">
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0065B3] to-[#F05922] px-6 py-8 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-white rounded-full p-3">
                  <FaUser className="text-[#0065B3] text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                  <p className="text-white/80 mt-1">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-[#F05922] text-[#F05922]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'bookmarks'
                    ? 'border-b-2 border-[#F05922] text-[#F05922]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaBookmark className="inline mr-2" />
                Bookmarks ({bookmarks.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    {!showEditForm && (
                      <button
                        onClick={() => setShowEditForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0065B3] text-white rounded-lg hover:bg-[#005a9e] transition"
                      >
                        <FaEdit /> Edit Profile
                      </button>
                    )}
                  </div>

                  {showEditForm ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#0065B3] text-white rounded-lg hover:bg-[#005a9e] transition"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditForm(false);
                            setFormData({ username: user.username, email: user.email });
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <p className="text-gray-900">{user.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Change Password */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <FaLock /> Change Password
                      </h3>
                      <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-[#0065B3] hover:text-[#005a9e]"
                      >
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>

                    {showPasswordForm && (
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0065B3]"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#0065B3] text-white rounded-lg hover:bg-[#005a9e] transition"
                        >
                          Update Password
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t pt-6">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Bookmarks</h2>
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12">
                      <FaBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No bookmarks yet</p>
                      <p className="text-gray-400 mt-2">
                        Start bookmarking posts to save them for later!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookmarks.map((bookmark) => {
                        const post = bookmark.postId;
                        if (!post) return null;
                        return (
                          <div
                            key={bookmark._id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                          >
                            {post.image && (
                              <img
                                src={
                                  post.image.startsWith('http')
                                    ? post.image
                                    : `http://localhost:5000${post.image}`
                                }
                                alt={post.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <Link
                                to={`/${post.category?.slug || ''}/${post._id}/${post.slug || ''}`}
                                className="block"
                              >
                                <h3 className="font-semibold text-lg mb-2 hover:text-[#F05922] transition">
                                  {post.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 mb-3">
                                {post.category?.name || 'Uncategorized'} •{' '}
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                              <button
                                onClick={() => handleRemoveBookmark(post._id)}
                                className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                              >
                                <FaBookmark /> Remove Bookmark
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;

