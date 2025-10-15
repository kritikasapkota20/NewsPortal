import React, { useState } from 'react';
import { FiLock, FiMail, FiUser, FiKey, FiLogOut } from 'react-icons/fi';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const logoutAdmin = async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/admin/logout", {}, { withCredentials: true });
          toast.success(response.data.message);
          setTimeout(() => navigate("/Admin/login"), 2000);
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong,Please try again");
        }
      };
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const togglePasswordForm = () => setShowPasswordForm(!showPasswordForm);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Profile Header */}
                <div className="bg-[#0065B3] px-6 py-8 text-center">
                  
                    <div className='flex items-center justify-center gap-3'>
                        <div className="  bg-white rounded-full  shadow-sm p-2 items-center mt-2 ">
                            <FiUser className="text-[#0065B3] w-6 h-6 " />
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-white mb-2">Kritika Sapkota</h1>

                    </div>
                    <p className="text-indigo-200 mt-2 flex items-center justify-center gap-2">
                        <FiMail className="inline" />
                        kritikasapkota.30@gmail.com
                    </p>
                    <span className="inline-block mt-3 px-4 py-1 bg-[#268fdf] text-white rounded-full text-sm font-medium">
                        Administrator
                    </span>
                </div>

                {/* Profile Content */}
                <div className="px-6 py-8 space-y-8">
                    {/* Security Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <FiKey className="text-[#F05922]" />
                            Account Security
                        </h2>

                        <button
                            onClick={togglePasswordForm}
                            className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <span className="text-gray-700 font-medium">Change Password</span>
                            <div className='bg-[#F05922] rounded-full p-3'>
                                <FiLock className="text-[white]" />
                            </div>
                        </button>

                        {showPasswordForm && (
                            <div className="mt-4 space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    />
                                </div>
                                <button className="w-full bg-[#0065B3] text-white py-3 rounded-lg hover:bg-[#F05922] transition-colors font-medium">
                                    Update Password
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-6" onClick={logoutAdmin}>
                        <button className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[#F05922] hover:bg-red-50 rounded-xl transition-colors font-medium">
                            <FiLogOut className="w-5 h-5" />
                            Logout Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;