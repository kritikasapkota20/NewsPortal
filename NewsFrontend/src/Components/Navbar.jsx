import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../assets/Navatalogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { BsClock } from 'react-icons/bs';
import { FaBars, FaTimes, FaKeyboard, FaHome } from "react-icons/fa";
import { BiSearch } from 'react-icons/bi';
import SearchModal from './SearchModal';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import UseDate from './UseDate';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { nepaliDate, englishDate, currentTime } = UseDate();
  const [weather, setWeather] = useState({ temperature: 'Loading...', city: 'kathmandu' });
  const [categories, setCategories] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  const fetchAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/user/getUser`, { withCredentials: true });
      setAuth({ authenticated: !!res.data?.authenticated, user: res.data?.user || null });
    } catch {
      setAuth({ authenticated: false, user: null });
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: "Kathmandu",
          appid: "ae9ae05987c3ac0fade68aca67c28c96",
          units: 'metric',
        }
      });
      setWeather({
        temperature: response.data.main.temp,
        city: "Kathmandu"
      })
    } catch (error) {
      console.log('Error fetching weather data ', error)
      setWeather({
        temperature: "N/A",
        city: "Kathmandu"
      });
    }
  };
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVERAPI}/categories`);
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
          // console.log(response.data.categories);
        } else {
          console.error("Unexpected response structure:", response.data)
        }
  
      }
      catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    useEffect(() => {
  const fetchNews = async () => {
    try {
      // Fetch all posts
      const allPostsResponse = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/getPosts`)
      const allPosts = allPostsResponse.data.posts;
      const featuredResponse = await axios.get(`${import.meta.env.VITE_SERVERAPI}/post/mainNews`);
      const featuredNews = featuredResponse.data.posts;
      // console.log(featuredNews);
      setFeaturedNews(featuredNews || []);
   
    }catch (error) {
      console.error("Error fetching featured news:", error);
    }
  };
    
  fetchNews();
}, []);
    
  useEffect(() => {
    fetchWeather();
    fetchCategories();
    fetchAuth();
    // Listen for login/logout events via localStorage to update navbar state
    const onStorage = (e) => {
      if (e.key === 'auth_change') fetchAuth();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = async () => {
    const ok = window.confirm('Are you sure you want to logout?');
    if (!ok) {
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/user/logout`, {}, { withCredentials: true });
      setShowProfileMenu(false);
      setAuth({ authenticated: false, user: null });
      try { localStorage.setItem('auth_change', Date.now().toString()); } catch(error) {
        console.error('Something Went Wrong');
      }
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const renderAuthButton = () => {
    if (auth.authenticated && auth.user) {
      return (
        <div className='relative'
             onMouseEnter={() => setShowProfileMenu(true)}
             onMouseLeave={() => setShowProfileMenu(false)}
        >
          <button className='nav-button  text-primary bg-white'>
            <FontAwesomeIcon icon={faUser} />
            <span>Hi! {auth.user.username?.split(' ')[0] || 'Profile'}</span>
            
          </button>
          {showProfileMenu && (
            <div className='absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50'>
              <Link to='/profile' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Profile</Link>
              <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>Logout</button>
            </div>
          )}
        </div>
      );
    }
    return (
      <Link to="/AuthForm">
        <button className='nav-button  text-primary bg-white'>
          <FontAwesomeIcon icon={faUser} />
          <span>Login</span>
        </button>
      </Link>
    );
  };

  return (
    <div className='relative'>
      {/* Top Bar */}
      <div className='w-full bg-gradient-to-r from-[#0066B3]/5 to-secondary/5'>
        <div className='max-w-7xl mx-auto justify-between items-center px-4 lg:px-8 py-3 flex flex-wrap md:flex-nowrap gap-3'>
                <div className='text-[15px] order-2 md:order-1 space-y-1 '>
                    {/* <p className='text-[#444] font-medium ptag'>{nepaliDate}</p> */}
                    {/* <div className='bg-secondary rounded-full p-4' >
                    <p className='font-bold'><span className='text-white'>E-</span> <span className='text-white'>NEWS</span></p>
                    </div> */}
                    <p className='text-[#888] ptag text-sm'>{englishDate}</p>

                </div>
                <div className='flex gap-1 order-1 md:order-2 mx-auto md:mx-0'>
                    {/* <img src={logo} alt='logo' className='w-[75px] h-[60px] md:w-[95px] md:h-[75px] object-contain' /> */}
                    <p className='text-[#388E3C] align-middle uppercase font-bold text-[36px] md:text-[50px] navatahead'>
                        {/* <span className='text-[#0066B3] logo-gradient'>नवता</span> */}
                    </p>
                </div>
                <div className='text-[#444] ptag order-3 space-y-2'>
                    <div className='flex gap-2.5 text-[14px] items-center'>
                        <TiWeatherPartlySunny className="text-[#0066B3] text-xl" />
                        <p>{weather.temperature} °C {weather.city}</p>
                    </div>
                    <div className='flex gap-2.5 items-center'>
                        <BsClock className="text-secondary" />
                        <p>{currentTime}</p>
                    </div>
                </div>
            </div>
      </div>
      {/* Main Navigation */}
      <div className='sticky top-0 z-50 bg-white shadow-md'>
        <div className="border-t border-gray-200"></div>
        <div className='w-full bg-primary'>
          <nav className='max-w-7xl mx-auto flex justify-between items-center px-4 lg:px-8'>
            <div className="hidden md:hidden lg:block w-full">
              <ul className='flex items-center py-3.5 text-white text-[16px] font-medium text-base'>
                <div className='flex items-center space-x-6 flex-1 justify-start '>
                  <Link to="/" className='nav-link-hover group'>
                    <FaHome size={20} className="text-white group-hover:scale-110 transition-all duration-300" />
                  </Link>
                 
                  {/* {categories.map((category) => (
  <Link
    key={category._id || category.id || category.name} // Adjust according to your backend
    to={`/${category.slug || category.name}`} // Use slug if available, fallback to name
    className="nav-link-hover"
  >
    {category.name}
  </Link>
))} */}
{categories.map((category) => {
  const slug = (category.slug || category.name)?.toLowerCase();
   if (slug === "head-news" || slug === "main-news") {
    return null;
  }
  
  const specialRoutes = ["entertainment", "health", "sports"];
  
  // Capitalized route for special categories
  const path = specialRoutes.includes(slug)
    ? `/category/${slug.charAt(0) + slug.slice(1)}`
    : `/category/${slug}`;
    
  return (
    <Link
      key={category._id || category.id || category.name}
      to={path}
      className="nav-link-hover"
    >
    
      {category.name}
    </Link>
  );
})}

                </div>

                <div className='flex items-center gap-3 ml-8'>
                  <Link to="unicode-converter" className='nav-button bg-gray-50 text-primary hover:bg-[#0066B] hover:text-whit'>
                    <FaKeyboard className="w-4 h-4" />
                    <span>युनिकोड</span>
                  </Link>
                  {renderAuthButton()}

                  {/* <button className='nav-button bg-gray-50  text-primary'>
                    EN
                  </button> */}

                  <button 
                    onClick={() => setIsSearchModalOpen(true)}
                    className='text-white transition-all duration-300'
                  >
                    <BiSearch size={24} className="hover:scale-110 transition-transform" />
                  </button>
                </div>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className='lg:hidden w-full flex justify-between items-center py-3.5'>
              <button 
                className=' p-2 text-white rounded-lg transition-all duration-300' 
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>

              <div className='flex items-center gap-2'>
                {auth.authenticated && auth.user ? (
                  <Link to="/profile">
                    <button className='nav-button-mobile bg-white text-primary '>
                      <FontAwesomeIcon icon={faUser} />
                      <span>Hi! {auth.user.username?.split(' ')[0] || 'Profile'}</span>
                    </button>
                  </Link>
                ) : (
                  <Link to="/AuthForm">
                    <button className='nav-button-mobile bg-white text-primary '>
                      <FontAwesomeIcon icon={faUser} />
                      <span>Login</span>
                    </button>
                  </Link>
                )}
                <button 
                  onClick={() => setIsSearchModalOpen(true)}
                  className='p-2 text-white hover:text-secondary rounded-lg transition-all duration-300'
                >
                  <BiSearch size={24} />
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-fit' : 'max-h-0'
            }`}
          >
            <div className='bg-white px-5 py-5 shadow-inner'>
              <ul className='space-y-4.5'>
                <Link to="/" className='mobile-nav-link flex items-center gap-2'>
                  <FaHome size={24} />
                  {/* <span>होमपेज</span> */}
                </Link>
                <Link to="/Samachar" className='mobile-nav-link'>समाचार</Link>
                <Link to="/Artha" className='mobile-nav-link'>अर्थ</Link>
                <Link to="/Bichar" className='mobile-nav-link'>बिचार</Link>
                <Link to="/Swasthya" className='mobile-nav-link'>स्वास्थ्य</Link>
                <Link to="/Manoranjan" className='mobile-nav-link'>मनोरञ्जन</Link>
                <Link to="/Shiksha" className='mobile-nav-link'>शिक्षा</Link>
                <Link to="/Khelkud" className='mobile-nav-link'>खेलकुद</Link>
                <Link to="/Feature" className='mobile-nav-link'>फिचर</Link>
                <Link to="/Other" className='mobile-nav-link'>अन्य</Link>
              </ul>

              <div className='mt-1 space-y-3'>
                <button className='w-fit nav-button-mobile   bg-[#0066B3] text-white'>
                  <FaKeyboard className="w-4 h-4" />
                  <span>युनिकोड</span>
                </button>
                
                {/* <button className='w-fit nav-button-mobile  bg-[#0066B3] text-white'>
                  EN
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />

      {/* Breaking News */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center bg-gradient-to-r from-[#0066B3]/5 to-secondary/5 rounded-lg p-3.5 transition-all duration-300 hover:shadow-md">
            <span className="font-bold text-[#0066B3] mr-4">BREAKING:</span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-[#6D6E70]">
                {featuredNews.length > 0 ? (
                  featuredNews.map((news, index) => (
                    // <>
                    <Link to={`/${(news.category?.slug || '').toLowerCase()}/${news._id}/${news.slug}`} key={index} className="hover:text-[#0066B3] transition-colors">
                    <span key={index} className="mr-8 hover:text-[#0066B3] cursor-pointer transition-colors">
                      • {news.title}
                    </span>
                    </Link>
                    // </>
                  ))
                ) : (
                  <span className="text-gray-500">No breaking news available</span>
                )}
              </div>
            </div>
               
{/* 
                <span className="mr-8 hover:text-[#0066B3] cursor-pointer transition-colors">• नेपालले जित्यो SAFF च्याम्पियनसिप</span>
                <span className="mr-8 hover:text-[#0066B3] cursor-pointer transition-colors">• नयाँ बजेटमा कर व्यवस्था मा परिवर्तन</span>
                <span className="mr-8 hover:text-[#0066B3] cursor-pointer transition-colors">• काठमाडौंमा भ्रष्टाचार सम्बन्धी नयाँ खुलासा</span>
                <span className="mr-8 hover:text-[#0066B3] cursor-pointer transition-colors">• काठमाडौंमा भ्रष्टाचार सम्बन्धी नयाँ खुलासा</span>
                <span className="mr-8 hover:text-[#0066B3] cursor-pointer transition-colors">• नेपालले जित्यो SAFF च्याम्पियनसिप</span> */}
          </div>
        </div>
      </div>

      <style>{`
        .nav-link-hover {
          position: relative;
          padding: 0.35rem;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .nav-link-hover::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2.5px;
          bottom: -2px;
          left: 50%;
          background-color: white;
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        
        .nav-link-hover:hover {
          color: white;
        }
        
        .nav-link-hover:hover::after {
          width: 100%;
        }
        
        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          transform-origin: center;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .nav-button-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .mobile-nav-link {
          display: block;
          padding: 0.75rem;
          color: #6D6E70;
          transition: all 0.3s ease;
          border-radius: 0.5rem;
          font-weight: 500;
        }
        
        .mobile-nav-link:hover {
          color: #0066B3;
          background-color: rgba(0, 102, 179, 0.05);
          transform: translateX(4px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .logo-gradient {
          background: linear-gradient(135deg, #0066B3, #ef6533);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <ToastContainer />
    </div>
  );
};

export default Navbar;