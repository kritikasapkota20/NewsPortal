import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NepaliDateConverter from 'nepali-date-converter';
import logo from "../assets/Navatalogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faChartLine, faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { BsClock } from 'react-icons/bs';
import { FaBars, FaChartLine, FaTimes, FaKeyboard, FaHome } from "react-icons/fa"; // FontAwesome close icon
import { BiSearch } from 'react-icons/bi';
import SearchModal from './SearchModal';
import { Link } from 'react-router-dom';
import { BiX } from 'react-icons/bi';
import UseDate from './UseDate';

const Navbar = () => {
  const [searchModal, setSearchModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const {nepaliDate,englishDate,currentTime}=UseDate();

  // const [currentDate, setCurrentDate] = useState(new Date());

  const [weather, setWeather] = useState({ temperature: 'Loading...', city: 'kathmandu' });

  // const [nepaliDate, setNepaliDate] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }
  const fetchWeather = async () => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: "Kathmandu",
          appid: "ae9ae05987c3ac0fade68aca67c28c96",
          units: 'metric',
        }
      });
      // console.log(response)
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
  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeather();
  }, []);
  return (
    <div className=''>
      <div className='w-full justify-between items-center px-6 md:px-12  py-0 pb-3 flex '>
        <div className='text-[15px]'>
          <p className='text-[#444] ptag'>{nepaliDate}</p>
          <p className='text-[#888] ptag'>{englishDate}</p>
        </div>
        <div className='flex gap-0'>
          <img src={logo} alt='logo' className=' w-[110px] h-[90px]' />
          <p className='text-[ #388E3C] align-middle uppercase font-bold text-[65px] navatahead'>
            <span className='text-[#0066B3] logo-gradient'>नवता </span>

          </p>
        </div>
        <div className='text-[#444] ptag'>
          <div className='flex gap-2 text-[15px]'>
            <TiWeatherPartlySunny style={{ fontSize: "25px" }} />
            <p>{weather.temperature} °C {weather.city}</p>
          </div>
          <div className='flex gap-2 mt-2 ptag'>
            <BsClock style={{ fontSize: "20px" }} />
            <p>{currentTime}</p>
          </div>
        </div>
      </div>
      {/* Medium and Large Size*/}
      <div className='bg-[white] shadow-2xl border-[#0066B3] border-t-[1.4px] width-full justify-between items-center md:px-12 px-6  py-3 text-[white] flex  '>
        <div className="noham ">
          <ul className='flex justify-between items-center  text-[#0066B3]  text-[17px] '>
            <Link to="/" className='nav-link cursor-pointer mt-[-5px] '><FaHome size={25}  /></Link>
            <Link to="/Samachar"> <li className='hover:text-[#f0ddd7] cursor-pointer nav-link  logo-gradient'>समाचार</li></Link>
          <Link to="/Artha">  <li className='hover:text-[#f0ddd7] cursor-pointer nav-link logo-gradient '>अर्थ</li></Link>
         <Link to="/Bichar">   <li className='hover:text-[#f0ddd7] cursor-pointer nav-link logo-gradient'>बिचार</li></Link>
         <Link to="/Swasthya"><li className='hover:text-[#f0ddd7] cursor-pointer nav-link logo-gradient'>स्वास्थ्य</li></Link>   
            {/* <li className='hover:text-[] cursor-pointer nav-link'>जीवनशैली</li> */}
          <Link to="/Manoranjan">  <li className='hover:text-[#f0ddd7] cursor-pointer nav-link logo-gradient'>मनोरञ्जन</li></Link>
            <li className='hover:text-[#f0ddd7] cursor-pointer nav-link logo-gradient'>शिक्षा</li>
            <li className='hover:text-[#f0ddd7] cursor-pointer nav-link logo-gradient'>खेलकुद</li>
            <li className='hover:text-[#f0ddd7] cursor-pointer nav-link logo-gradient'>फिचर </li>
            {/* <li className='hover:text-[] cursor-pointer nav-link'>सेयर बजार</li> */}

            <li className='hover:text-[#f0ddd7] cursor-pointer nav-link mr-5 logo-gradient'>अन्य</li>
          </ul>
        </div>
        <div className='flex gap-3 h-10 noham '>
          {/* <div className='flex gap-2 bg-[white] text-[#2E86C1]  py-2 h-10 px-2 rounded-[4px] hover:bg-[#3298db] hover:text-white list-none cursor-pointer'>
            <li><FontAwesomeIcon icon={faCalendarDays} /></li>
            <li>पात्रो</li>
          </div> */}
          {/* <li className='list-none px-3 py-2 cursor-pointer '><FontAwesomeIcon icon={faChartLine} /></li> */}
          <div className='flex list-none px-2 py-2 gap-2   text-[white] bg-[#0066B3] hover:text-white cursor-pointer  rounded-[4px]'>
            <li className='mt-1 logo-gradient'><FaKeyboard style={{ width: "16px", height: "16px" }} /></li>
            <li className=' '>युनिकोड</li>
          </div>
       <Link to="/AuthForm">  <div className='flex list-none px-2 py-2 gap-2   text-[white] bg-[#0066B3] hover:text-white cursor-pointer rounded-[4px]'>

            <Link to="/AuthForm" > <li className=''><FontAwesomeIcon icon={faUser} /></li></Link>
            <Link to="/AuthForm"><li className=' '>Login</li></Link>
          </div></Link> 
          <div className='  text-[white] py-2 px-3 list-none rounded-full cursor-pointer bg-[#0066B3]  '>
            <li className=''>EN</li>
          </div>
          {showSearchBox ? (<div className='py-2 px-2 text-[30px] cursor-pointer logo-gradient ' >
            <BiX  style={{ color:"#0066B3" }} onClick={() => {
              setShowSearchBox(!showSearchBox)
              setSearchModal(false)
            }}  />
            </div>) :
            <div className='py-2 px-2 text-[30px] cursor-pointer'>
              <BiSearch style={{color:"#0066B3"}}   onClick={() => {
                setShowSearchBox(!showSearchBox)
                setSearchModal(false)
              }
              } /> </div>}

          {showSearchBox && (
            <div className="absolute top-48 right-0 mt-4 mr-4 bg-white drop-shadow-2xl rounded-lg border border-slate-200 flex items-center p- w-60 h-14 transition-all duration-300 z-10">
              <input
                type="text"
                placeholder="Search..."
                onChange={() => setSearchModal(true)}
                className="flex-1 outline-none px-2 text-[#464545]"
                autoFocus
              />
              <div className="bg-[#F05922]  p-2 px-4 hover:bg-[#ef6533] cursor-pointer flex items-center justify-center h-full ">
                <BiSearch className="text-white text-xl " />
              </div>
              {searchModal && <SearchModal />}
              {/* <SearchModal/> */}
            </div>

          )}
          
        </div>
        
        {/* Mobile Hamburger*/}

        <div className='ham flex flex-nowrap justify-between w-full  items-center px-1 py-3 '>

          {!isMobileMenuOpen && (
            <FaBars className="text-white text-[25px] hamicon" onClick={toggleMobileMenu} />
          )}

          {isMobileMenuOpen && (
            <>
              {/* <div className="absolute mt-[460px] bg-[#362d2d] bg-opacity-80 flex flex-col items-end space-y-2 py-7 px-6 hammenu transition-all  ease-in-out duration-3000  "> */}
              <FaTimes className="text-white text-[25px]" onClick={toggleMobileMenu} />

              {/* <div className='bg-[#2260bf] width-full justify-between items-center px-7 py-2 text-[white] flex '> */}
              <div className=' absolute mt-[500px] px-6 ml-[-55px] text-[19px] w-[250px]  bg-white shadow-2xl '>

                <div className="block p-5 text-[#423f3f]">
                  <ul className=''>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link '>होमपेज</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>समाचार</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>बिजनेस</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>जीवनशैली</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>मनोरञ्जन</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>बिचार</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>खेलकुद</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>फिचर </li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>स्वास्थ्य</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link'>सेयर बजार</li>
                    <li className='hover:text-[#F05922] cursor-pointer nav-link mr-5'>अन्य</li>
                    <li>पात्रो</li>
                    <li>EN</li>

                  </ul>
                </div>
                {/* </div> */}

              </div>
            </>
          )}
          <div className='flex gap-4 login'>
            <Link to="/AuthForm"> <div className='flex list-none px-2 py-2 gap-3 text-[#0066B3] bg-white hover:bg-[#3a77d3] cursor-pointer rounded-[4px]'>
              <li><FontAwesomeIcon icon={faUser} /></li>
              <li className='text-[px]'>Login</li> </div></Link>

            {/* <div className='bg-white py-2 px-3 text-[#0066B3] list-none rounded-full cursor-pointer hover:bg-[#D1481A]'>
              <li>EN</li>
            </div> */}
            <div className='py-2 px-2 text-[30px] bg-white rounded-full shadow-lg hover:shadow-xl transition duration-300 cursor-pointer justify-center' >
              <BiSearch className='text-[#0066B3]' onClick={() => {
                setShowSearchBox(!showSearchBox)
                setSearchModal(false)
              }
              } /></div>
            {showSearchBox && (
              <div className="absolute top-48 right-0 mt-4 mr-4 bg-white drop-shadow-2xl rounded-lg flex items-center p- w-60 h-12 transition-all duration-300 z-10">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={() => setSearchModal(true)}
                  className="flex-1 outline-none px-2 text-[#464545]"
                  autoFocus
                />
                <div className="bg-[#F05922]  p-2 px-4 hover:bg-[#ef6533] cursor-pointer flex items-center justify-center h-full ">
                  <BiSearch className="text-white text-xl" />
                </div>
                {searchModal && <SearchModal />}
                {/* <SearchModal/> */}
              </div>

            )}
          </div>




        </div>
      </div>
       {/* Breaking News Ticker */}
              <div className="border border-t-2 border-[]  text-[white]] text-black py-3 px-6 md:px-12  mb-6 rounded-md flex items-center">
                <span className="font-bold mr-4">BREAKING:</span>
                <div className="flex-1 overflow-hidden">
                  <div className="animate-marquee whitespace-nowrap text-[15px] text-[#4d4c4c]  font-bold cursor-pointer">
                    <span className="mr-8  ">• नेपालले जित्यो SAFF च्याम्पियनसिप</span>
                    <span className="mr-8 ">• नयाँ बजेटमा कर व्यवस्था मा परिवर्तन</span>
                    <span className="mr-8 ">• काठमाडौंमा भ्रष्टाचार सम्बन्धी नयाँ खुलासा</span>
                    <span className="mr-8 ">• काठमाडौंमा भ्रष्टाचार सम्बन्धी नयाँ खुलासा</span>
                    <span className="mr-8  ">• नेपालले जित्यो SAFF च्याम्पियनसिप</span>
                  </div>
                </div>
              </div>
    </div>
  );
};

export default Navbar;