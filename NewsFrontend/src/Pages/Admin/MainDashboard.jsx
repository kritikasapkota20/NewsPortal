import { useState } from "react";
import { FaUser, FaNewspaper, FaComments, FaChartLine, FaBars } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import { MdDashboard, MdCategory, MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <aside className={`bg-white shadow-md ${isSidebarOpen ? "w-64" : "w-16"} transition-all`}> 
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-xl font-bold text-blue-700 ${!isSidebarOpen && "hidden"}`}>नवता न्यूज</h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 text-2xl">
            <FaBars />
          </button>
        </div>
        <nav className="mt-4">
          {[
            { name: "Dashboard", icon: <MdDashboard />, link: "#" },
            { name: "Create Post", icon: <IoMdCreate />, link: "#" },
            { name: "Users", icon: <FaUser />, link: "#" },
            { name: "Categories", icon: <MdCategory />, link: "#" },
            { name: "Comments", icon: <FaComments />, link: "#" },
            { name: "Settings", icon: <MdSettings />, link: "#" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 transition rounded-md"
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className={!isSidebarOpen ? "hidden" : "block"}>{item.name}</span>
            </a>
          ))}
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
  <MdDashboard className="text-[#0065B3] text-2xl" />
  <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
</div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { name: "Total Posts", count: 124, icon: <FaNewspaper /> },
            { name: "All Users", count: 56, icon: <FaUser /> },
            { name: "Total Comments", count: 234, icon: <FaComments /> },
            // { name: "Site Views", count: "1.2K", icon: <FaChartLine /> },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center h-52">
              <div className="ml-4 flex gap-3">
             
              <div className="text-[#0065B3] text-3xl">{stat.icon}</div>
                <p className="text-gray-600 text-2xl">{stat.name}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-center mt-5 ">{stat.count}</h3>
              </div>
              <h3 className="text-gray-500 text-center  mt-7 text-sm">Showing {stat.name} </h3>
            </div>
          ))}
        </div>
        
        {/* Recent Activity & Trending */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Recent Articles</h3>
            <ul className="space-y-2">
              {["Breaking News: Market Crash", "New Tech Trends in 2025", "Sports Update: Final Match Highlights"].map((news, index) => (
                <li key={index} className="border-b py-2">{news}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Trending Articles</h3>
            <ul className="space-y-2">
              {["New Government Policies", "SpaceX's Next Mission", "Crypto Market Rise"].map((news, index) => (
                <li key={index} className="border-b py-2">{news}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { name: "Create Post", path: "/admin/create-post" },
            { name: "Manage Post", path: "/admin/manage-posts" },
            { name: "Manage Users", path: "/admin/users" },
            { name: "Manage Categories", path: "/admin/categories" },

            { name: "View Comments", path: "/admin/comments" }
          ].map((action, index) => (
            <Link key={index} to={action.path}>
              <button className="w-full bg-[#0065B3] text-white p-3 rounded-lg shadow hover:bg-[#F05922] transition">
                {action.name}
              </button>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
