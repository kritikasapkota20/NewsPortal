import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginAdmin = async (data) => {
    try {

      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/admin/login", data, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setTimeout(() => navigate("/Admin/Dashboard"), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong, Please try again";
      toast.error(errorMessage);
      setLoading(false);
    } 
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    loginAdmin(data);  // Call login function manually
    setTimeout(() => {
    event.target.reset();
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-[400px] h-[450px] p-5 bg-white shadow-lg transform transition-all duration-300 rounded-lg hover:shadow-2xl hover:scale-95">
        {/* <Link to="/">
          <div className="hover:bg-[rgb(0,102,179)] bg-[#F05922] cursor-pointer text-white rounded-full ml-auto w-5 pr-6 pl-2 pt-2 pb-2">
            <FaTimes />
          </div>
        </Link> */}
        <h2 className="text-[26px] font-semibold text-center mb-11">
          <span className="logo-gradient">Admin</span> <span className="logo-gradient">Login</span>
        </h2>

        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <input name="email" placeholder="Email" type="email" className="w-full p-2 border rounded h-14" required />
          </div>
          <div className="mb-8">
            <input name="password" placeholder="Password" type="password" className="w-full p-2 border rounded h-14" required />
          </div>
          <button type="submit" className="w-full p-2 bg-[#0066B3] hover:bg-[#F05922] text-white rounded text-xl h-12">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
