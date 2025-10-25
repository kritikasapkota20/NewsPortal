import React, { useState } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchModal from "./SearchModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const logoutAdmin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/admin/logout", {}, { withCredentials: true });
      toast.success(response.data.message);
      setTimeout(() => navigate("/Admin/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong,Please try again");
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between fixed top-0 right-0 left-72 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl lg:max-w-3xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts, users, categories..."
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-primary focus:ring-2 focus:border-gray-300 transition-all cursor-pointer"
            readOnly
          />
          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition-all cursor-pointer">
              <FaSearch className="text-lg" />
            </div>
          </button>
        </div>
      </div>

      {/* Right Side - Profile Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 cursor-pointer transition-all"
            onClick={toggleDropdown}
          >
            <FaUser className="text-xl" />
          </div>

          {isDropdownOpen && (
            <div className='absolute top-14 right-0 w-52 bg-white shadow-lg rounded-xl py-2 border border-gray-100'>
              <Link to="/Admin/profile">
              <div className='flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer transition-all'>
               
                <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200'>
                  <FaUser className='text-lg' />
                </div>
                <span className="font-medium">Profile</span>
              </div>
              </Link>
              <div
                className='flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer transition-all'
                onClick={logoutAdmin}
              >
                <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200'>
                  <LuLogOut className='text-lg' />
                </div>
                <span className="font-medium">Logout</span>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;