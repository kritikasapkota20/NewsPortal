import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLocationArrow,
  FaPhone,
  FaEnvelope,
  FaInstagram
} from "react-icons/fa";
import logo from "../assets/Navatalogo.png";
import { Link } from "react-router-dom";

// Helper function to split array into N columns
const splitIntoColumns = (arr, numCols) => {
  const cols = Array.from({ length: numCols }, () => []);
  arr.forEach((item, idx) => {
    cols[idx % numCols].push(item);
  });
  return cols;
};

const Footer = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/categories`);
      // console.log("Fetched categories:", response.data);
      if (response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <footer className="bg-primary shadow-lg text-white">
      <div className="border-t border-gray-400"></div>
      <div className="mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 text-[15px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Contact */}
          <div className="md:pr-8">
            <h3 className="font-bold text-lg mb-5 sm:mb-7">Contact Us</h3>
            <div className="flex gap-3 mb-4 sm:mb-5 items-center group">
              <div className="rounded-full bg-white p-2 shadow-md transition-all duration-300 group-hover:bg-secondary group-hover:scale-110">
                <FaLocationArrow className="text-secondary text-xs group-hover:text-white transform transition-all duration-300" />
              </div>
              <p className="hover:text-[#c4bfbf] transition-colors duration-300">Thimi, Bhaktapur</p>
            </div>
            <div className="flex gap-3 mb-4 sm:mb-5 items-center group">
              <div className="rounded-full bg-white p-2 shadow-md transition-all duration-300 group-hover:bg-secondary group-hover:scale-110">
                <FaPhone className="text-secondary text-xs group-hover:text-white transform transition-all duration-300" />
              </div>
              <p className="hover:text-[#c4bfbf] transition-colors duration-300">01-32478798, 01-34683990</p>
            </div>
            <div className="flex gap-3 items-center group">
              <div className="rounded-full bg-white p-2 shadow-md transition-all duration-300 group-hover:bg-secondary group-hover:scale-110">
                <FaEnvelope className="text-secondary text-xs group-hover:text-white transform transition-all duration-300" />
              </div>
              <p className="hover:text-[#c4bfbf] transition-colors duration-300">info@newsportal.com</p>
            </div>
          </div>

          {/* Vertical Line - Hidden on mobile */}
          <div className="hidden md:block absolute left-1/3 h-[300px] w-px bg-gray-400"></div>

          {/* Middle Section - Useful Links */}
          <div className="md:col-span-2 md:pl-8">
            <h3 className="font-bold text-lg mb-5 sm:mb-7">Useful Links</h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-4 sm:gap-y-6">
              {/* Dynamic Category Columns */}
              
              {splitIntoColumns(categories, 2).map((col, colIdx) => (
  <div key={colIdx} className="space-y-3 sm:space-y-4 max-w-fit">
    {col.map((cat, i) => (
      <p
        key={cat._id || i}
        className="hover:text-primary hover:ml-1 cursor-pointer nav-link-hover transition-all duration-300"
      >
        <Link to={`/category/${cat.slug}`}>
          {cat.name}
        </Link>
      </p>
    ))}
  </div>
))}


              {/* Static Column */}
              <div className="space-y-3 sm:space-y-4 max-w-fit">
                <p className="hover:text-primary hover:ml-1 cursor-pointer nav-link-hover transition-all duration-300">Privacy Policy</p>
                <p className="hover:text-primary hover:ml-1 cursor-pointer nav-link-hover transition-all duration-300">Terms and Conditions</p>
                <p className="hover:text-primary hover:ml-1 cursor-pointer nav-link-hover transition-all duration-300">Nepali Date Converter</p>
                <p className="hover:text-primary hover:ml-1 cursor-pointer nav-link-hover transition-all duration-300">Preeti Unicode Converter</p>
                
              </div>
               <div className="space-y-3 sm:space-y-4 max-w-fit">
                <p className="hover:text-primary hover:ml-1 cursor-pointer nav-link-hover transition-all duration-300">Advertisment</p>
                <p className="hover:text-primary hover:ml-1 cursor-pointer nav-link-hover transition-all duration-300">Our Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 border-t border-gray-400 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-sm sm:text-base">
            © 2025 Copyright Discovery News Network | All rights reserved.
          </p>
          <p className="text-xs sm:text-sm">
            Designed & Developed By:{" "}
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#6D6E70] hover:text-[#0066B3] hover:font-medium"
            >

            </a>
          </p>
          <div className="flex gap-2 sm:gap-3">
            <div className="rounded-full p-1.5 sm:p-2 cursor-pointer bg-white hover:bg-secondary transition-all duration-300 transform hover:scale-110 shadow-md">
              <a href="https://www.facebook.com/NavataNews" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="text-lg sm:text-xl text-secondary hover:text-white transition-colors duration-300" />
              </a>
            </div>
            <div className="rounded-full p-1.5 sm:p-2 cursor-pointer bg-white hover:bg-secondary transition-all duration-300 transform hover:scale-110 shadow-md">
              <FaTwitter className="text-lg sm:text-xl text-secondary hover:text-white transition-colors duration-300" />
            </div>
            <div className="rounded-full p-1.5 sm:p-2 cursor-pointer bg-white hover:bg-secondary transition-all duration-300 transform hover:scale-110 shadow-md">
              <a href="https://www.youtube.com/@navatanews22" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="text-lg sm:text-xl text-secondary hover:text-white transition-colors duration-300" />
              </a>
            </div>
            <div className="rounded-full p-1.5 sm:p-2 cursor-pointer bg-white hover:bg-secondary transition-all duration-300 transform hover:scale-110 shadow-md">
              <FaInstagram className="text-lg sm:text-xl text-secondary hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
