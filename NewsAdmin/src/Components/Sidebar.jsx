import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdDashboardCustomize, MdManageSearch, MdSettings } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { ImUsers } from "react-icons/im";
import { TbCategoryFilled } from "react-icons/tb";
import { LiaCommentSolid } from "react-icons/lia";
import { FaBars, FaClipboardCheck } from "react-icons/fa";
import axios from 'axios'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(`${API}/admin/posts/pending`, { withCredentials: true })
        const count = Array.isArray(res.data?.posts) ? res.data.posts.length : 0
        setPendingCount(count)
      } catch (e) {
        setPendingCount(0)
      }
    }
    fetchPending()
    const id = setInterval(fetchPending, 30000)
    return () => clearInterval(id)
  }, [])

  const isActive = (path) => {
    if (
      location.pathname === "/Admin" ||
      location.pathname === "/Admin/" ||
      location.pathname === "/Admin/dashboard" ||
      location.pathname.startsWith("/Admin/edit-post/")
    ) {
      return path.toLowerCase() === "/admin/dashboard";
    }
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboardCustomize />, path: "/Admin/dashboard" },
    // { name: "Create Post", icon: <IoIosCreate />, path: "/Admin/create-post" },
    { name: "Manage Post", icon: <MdManageSearch />, path: "/Admin/manage-posts" },
    { name: "Review Posts", icon: <FaClipboardCheck />, path: "/Admin/review-posts" },
    { name: "Users", icon: <ImUsers />, path: "/Admin/users" },
    { name: "Categories", icon: <TbCategoryFilled />, path: "/Admin/manage-categories" },
    { name: "Comments", icon: <LiaCommentSolid />, path: "/Admin/comments" },
    { name: "Settings", icon: <MdSettings />, path: "/Admin/settings" },
  ];
  return (
    <div className={`bg-primary shadow-lg fixed left-0 top-0 h-screen transition-all duration-300 flex flex-col ${isCollapsed ? 'w-28' : 'w-72'}`}>
      {/* Logo and Toggle Button */}
      <div className='py-6 px-4 flex items-center justify-between'>
        {!isCollapsed && (
          <Link to="/Admin/dashboard" className='flex items-center gap-3'>
            {/* <span className="text-2xl font-bold text-primary">नवता</span>
            <span className="text-2xl font-bold text-[#F05922]">न्यूज</span> */}
            {/* <span className='text-white font-bold text-3xl'>Navata News</span> */}
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg  transition-colors"
        >
          <FaBars className="text-white text-xl" />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className='flex-1 mt-6 px-3 overflow-y-auto'>
        {!isCollapsed && (
          <div className='px-4 mb-6'>
            <span className='text-white uppercase text-sm font-semibold tracking-wider'>Main Menu</span>
          </div>
        )}

        <ul className='space-y-1'>
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <Link key={index} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3.5 mb-3 rounded-lg cursor-pointer transition-all duration-300 group ${
                    active ? 'bg-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                      active
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <div className="relative">
                      <li
                        className={`font-medium ${
                          active
                            ? 'text-primary'
                            : 'text-white group-hover:text-primary'
                        }`}
                      >
                        {item.name}
                      </li>
                      {item.path === '/Admin/review-posts' && pendingCount > 0 && (
                        <span className="absolute -top-3 -right-5 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-semibold bg-red-500 text-white rounded-full px-1 shadow-sm">
                          {pendingCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </ul>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              A
            </div>
            <div>
              <p className="font-medium text-white">Admin User</p>
              <p className="text-sm text-white">Administrator</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;