import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-72">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 left-72 z-10 bg-white shadow-sm">
          <Navbar />
        </div>
        
        {/* Content area with top padding for navbar */}
        <div className="mt-[64px] p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 