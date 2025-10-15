import { useEffect, useState } from "react";
import { FaUser, FaNewspaper, FaComments, FaChartLine, FaBars } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import { MdDashboard, MdCategory, MdSettings, MdManageSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { use } from "react";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [countPosts,SetCountPosts]=useState(0);
  const [countCategories,SetCountCategories]=useState(0);
   const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/categories`);
        if (response.data && Array.isArray(response.data.categories)) {
       
        const totalCategories=  response.data.categories.length;
        SetCountCategories(totalCategories);
        } else {
          console.error("Unexpected response structure:", response.data)
        }
  
      }
      catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/post/getPosts");
     if (response.data.success) {
      const count = response.data.count;
      SetCountPosts(count);
      // console.log(response.data.count); 
    }
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };
    useEffect(() => {
fetchPosts();
fetchCategories();
  },[]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
          <MdDashboard className="text-[#0065B3] text-2xl" />
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { name: "Total Posts", count: countPosts, icon: <FaNewspaper /> },
            { name: "Total Categories", count:countCategories, icon: <FaComments /> },

            { name: "All Users", count: 56, icon: <FaUser /> },
            { name: "Total Comments", count: 234, icon: <FaComments /> },

          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center h-52">
              <div className="ml-4 flex gap-3">
                <div className="text-[#0065B3] text-3xl">{stat.icon}</div>
                <p className="text-gray-600 text-2xl">{stat.name}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-center mt-5">{stat.count}</h3>
              </div>
              <h3 className="text-gray-500 text-center mt-7 text-sm">Showing {stat.name}</h3>
            </div>
          ))}
        </div>

        {/* Recent Activity & Trending */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaNewspaper className="text-blue-500" />
              Recent Articles
            </h3>
            <ul className="space-y-3">
              {[
                { title: "Breaking News: Market Crash", time: "2 hours ago" },
                { title: "New Tech Trends in 2025", time: "4 hours ago" },
                { title: "Sports Update: Final Match Highlights", time: "6 hours ago" },
              ].map((news, index) => (
                <li key={index} className="border-b border-gray-100 pb-3 last:border-0">
                  <p className="text-gray-800 font-medium">{news.title}</p>
                  <span className="text-gray-500 text-sm">{news.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-500" />
              Trending Articles
            </h3>
            <ul className="space-y-3">
              {[
                { title: "New Government Policies", views: "1.2K views" },
                { title: "SpaceX's Next Mission", views: "2.5K views" },
                { title: "Crypto Market Rise", views: "3.1K views" },
              ].map((news, index) => (
                <li key={index} className="border-b border-gray-100 pb-3 last:border-0">
                  <p className="text-gray-800 font-medium">{news.title}</p>
                  <span className="text-gray-500 text-sm">{news.views}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Create Post", path: "/admin/create-post", icon: <IoMdCreate /> },
              { name: "Manage Post", path: "/admin/manage-posts", icon: <MdManageSearch /> },
              { name: "Manage Users", path: "/admin/users", icon: <FaUser /> },
              { name: "View Comments", path: "/admin/comments", icon: <FaComments /> },
            ].map((action, index) => (
              <Link key={index} to={action.path}>
                <button className="w-full bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center gap-2">
                  <div className="text-2xl text-[#0065B3]">{action.icon}</div>
                  <span className="text-gray-700 font-medium">{action.name}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
