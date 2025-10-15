import Navbar from "../../Components/Admin/Navbar";
import Sidebar from "../../Components/Admin/Sidebar";
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
  return (
    <div className="">
      <ToastContainer />
      <Navbar />
      <Sidebar />
    </div>
  );
};

export default Dashboard;
