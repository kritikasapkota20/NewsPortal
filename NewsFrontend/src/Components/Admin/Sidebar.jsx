import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdDashboardCustomize } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { ImUsers } from "react-icons/im";
import { TbCategoryFilled } from "react-icons/tb";
import logo from '../../assets/logos.png'
import { MdManageSearch } from "react-icons/md";
import { LiaCommentSolid } from "react-icons/lia";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    // If we're at the root admin path or any subpath that doesn't match other menu items
    if (location.pathname === "/Admin" || 
        location.pathname === "/Admin/" || 
        location.pathname === "/Admin/dashboard" ||
        location.pathname.startsWith("/Admin/edit-post/")) {
      return path.toLowerCase() === "/admin/dashboard";
    }
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  return (
    <div className='w-72 min-h-screen bg-white shadow-lg fixed left-0 top-0 border-r'>
      {/* Logo and Brand */}
      <div className='py-6 px-4'>
        <Link to="/Admin/dashboard" className='flex items-center gap-3'>
          {/* <img
            src={logo}
            alt="नवता न्यूज"
            className="w-12 h-12 rounded-xl object-cover transition-transform hover:scale-105"
          />
          <div>
            <span className="logo-gradient font-extrabold text-2xl">नवता </span>
            <span className="logo-gradient font-extrabold text-2xl">न्यूज</span>
          </div> */}
        </Link>
      </div>
      {/* Navigation Menu */}
      <div className='mt-6 px-3'>
        <div className='px-4 mb-6'>
          <span className='text-gray-400 uppercase text-sm font-semibold tracking-wider'>Main Menu</span>
        </div>

        <ul className='space-y-1 text-lg ' >
          <Link to="/Admin/dashboard">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-lg cursor-pointer transition-all duration-300 group ${isActive('/Admin/dashboard') ? 'bg-red-50' : 'hover:bg-red-50'}`}>
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive('/Admin/dashboard') ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#F05922] group-hover:text-white'}`}>
                <MdDashboardCustomize className="text-xl" />
              </div>
              <li className={`font-medium  ${isActive('/Admin/dashboard') ? 'text-[#F05922]' : 'text-gray-700 group-hover:text-[#F05922]'}`}>Dashboard</li>
            </div>
          </Link>

          <Link to="/Admin/create-post">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-lg cursor-pointer transition-all duration-300 group ${isActive('/Admin/create-post') ? 'bg-red-50' : 'hover:bg-red-50'}`}>
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive('/Admin/create-post') ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#F05922] group-hover:text-white'}`}>
                <IoIosCreate className="text-xl" />
              </div>
              <li className={`font-medium ${isActive('/Admin/create-post') ? 'text-[#F05922]' : 'text-gray-700 group-hover:text-[#F05922]'}`}>Create Post</li>
            </div>
          </Link>
          <Link to="/Admin/manage-posts">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-lg cursor-pointer transition-all duration-300 group ${isActive('/Admin/manage-posts') ? 'bg-red-50' : 'hover:bg-red-50'}`}>
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive('/Admin/manage-posts') ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#F05922] group-hover:text-white'}`}>
                <MdManageSearch className="text-xl" />
              </div>
              <li className={`font-medium ${isActive('/Admin/manage-posts') ? 'text-[#F05922]' : 'text-gray-700 group-hover:text-[#F05922]'}`}>Manage Post</li>
            </div>
          </Link>
          <Link to="/Admin/users">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-lg cursor-pointer transition-all duration-300 group ${isActive('/Admin/users') ? 'bg-red-50' : 'hover:bg-red-50'}`}>
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive('/Admin/users') ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#F05922] group-hover:text-white'}`}>
                <ImUsers className="text-xl" />
              </div>
              <li className={`font-medium ${isActive('/Admin/users') ? 'text-[#F05922]' : 'text-gray-700 group-hover:text-[#F05922]'}`}>Users</li>
            </div>
          </Link>

          <Link to="/Admin/categories">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-lg cursor-pointer transition-all duration-300 group ${isActive('/Admin/categories') ? 'bg-red-50' : 'hover:bg-red-50'}`}>
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive('/Admin/categories') ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#F05922] group-hover:text-white'}`}>
                <TbCategoryFilled className="text-xl" />
              </div>
              <li className={`font-medium ${isActive('/Admin/categories') ? 'text-[#F05922]' : 'text-gray-700 group-hover:text-[#F05922]'}`}>Categories</li>
            </div>
          </Link>

          <Link to="/Admin/comments">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-lg cursor-pointer transition-all duration-300 group ${isActive('/Admin/comments') ? 'bg-red-50' : 'hover:bg-red-50'}`}>
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive('/Admin/comments') ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#F05922] group-hover:text-white'}`}>
                <LiaCommentSolid className="text-xl" />
              </div>
              <li className={`font-medium ${isActive('/Admin/comments') ? 'text-[#F05922]' : 'text-gray-700 group-hover:text-[#F05922]'}`}>Comments</li>
            </div>
          </Link>

          <Link to="/Admin/settings">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-lg cursor-pointer transition-all duration-300 group ${isActive('/Admin/settings') ? 'bg-red-50' : 'hover:bg-red-50'}`}>
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive('/Admin/settings') ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#F05922] group-hover:text-white'}`}>
                <TbCategoryFilled className="text-xl" />
              </div>
              <li className={`font-medium ${isActive('/Admin/settings') ? 'text-[#F05922]' : 'text-gray-700 group-hover:text-[#F05922]'}`}>Settings</li>
            </div>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar