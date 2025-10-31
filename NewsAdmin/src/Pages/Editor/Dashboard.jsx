import { useEffect, useState } from "react";
import { FaUser, FaNewspaper, FaComments, FaChartLine } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import { MdDashboard, MdManageSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import EditorNavbar from '../../components/EditorNavbar'
import EditorSidebar from '../../components/EditorSidebar'

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api'

const Dashboard = () => {
  const [countPosts, setCountPosts] = useState(0);
  const [countDrafts, setCountDrafts] = useState(0);
  const [countPending, setCountPending] = useState(0);
  const [countPublished, setCountPublished] = useState(0);

  const fetchEditorStats = async () => {
    try {
      const response = await axios.get(`${API}/editor/posts`, { withCredentials: true });
      if (response.data.posts) {
        const posts = response.data.posts;
        setCountPosts(posts.length);
        setCountDrafts(posts.filter(p => p.status === 'draft').length);
        setCountPending(posts.filter(p => p.status === 'pending_review').length);
        setCountPublished(posts.filter(p => p.status === 'published').length);
      }
    } catch (error) {
      console.log("Error fetching editor stats", error);
    }
  };

  useEffect(() => {
    fetchEditorStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <EditorNavbar />
      <div className="flex">
        <EditorSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
            <MdDashboard className="text-[#0065B3] text-2xl" />
            <h1 className="text-2xl font-semibold text-gray-800">Editor Dashboard</h1>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {[
              { name: "Total Posts", count: countPosts, icon: <FaNewspaper />, color: "text-blue-500" },
              { name: "Drafts", count: countDrafts, icon: <IoMdCreate />, color: "text-yellow-500" },
              { name: "Pending Review", count: countPending, icon: <FaChartLine />, color: "text-orange-500" },
              { name: "Published", count: countPublished, icon: <FaComments />, color: "text-green-500" },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center h-52">
                <div className="ml-4 flex gap-3">
                  <div className={`${stat.color} text-3xl`}>{stat.icon}</div>
                  <p className="text-gray-600 text-2xl">{stat.name}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-center mt-5">{stat.count}</h3>
                </div>
                <h3 className="text-gray-500 text-center mt-7 text-sm">Showing {stat.name}</h3>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaNewspaper className="text-blue-500" />
                Recent Posts
              </h3>
              <ul className="space-y-3">
                {[
                  { title: "Breaking News: Market Update", time: "2 hours ago", status: "draft" },
                  { title: "Tech Trends Analysis", time: "4 hours ago", status: "pending_review" },
                  { title: "Sports Highlights", time: "6 hours ago", status: "published" },
                ].map((news, index) => (
                  <li key={index} className="border-b border-gray-100 pb-3 last:border-0">
                    <p className="text-gray-800 font-medium">{news.title}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">{news.time}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        news.status === 'published' ? 'bg-green-100 text-green-700' : 
                        news.status === 'pending_review' ? 'bg-orange-100 text-orange-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {news.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaChartLine className="text-green-500" />
                Post Status Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Draft Posts</span>
                  <span className="font-semibold text-yellow-600">{countDrafts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Review</span>
                  <span className="font-semibold text-orange-600">{countPending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Published</span>
                  <span className="font-semibold text-green-600">{countPublished}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Create Post", path: "/Editor/create-post", icon: <IoMdCreate /> },
                { name: "Manage Posts", path: "/Editor/manage-posts", icon: <MdManageSearch /> },
                { name: "Profile", path: "/Editor/profile", icon: <FaUser /> },
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
    </div>
  );
};

export default Dashboard;


