import React, { useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook,FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";  
import axiosInstance from "../api/axios";

axiosInstance.get("/api/posts");


const AuthForm = () => {
const [isSignup,setIsSignup]=useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const navigate = useNavigate();
const location = useLocation();
const formRef = useRef(null);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const verifiedParam = params.get('verified');
  const emailParam = params.get('email');
  if (location.state?.fromVerify || verifiedParam === '1') {
    setIsSignup(false);
    if (location.state?.email) setEmail(location.state.email);
    if (emailParam) setEmail(emailParam);
    setPassword("");
    setName("");
    setConfirmPassword("");
    if (formRef.current) formRef.current.reset();
    if (location.state?.message || verifiedParam === '1') {
      toast.success(location.state?.message || 'Your email is verified. Please login.');
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, [location.state, location.search]);

useEffect(() => {
  // React when verification happens in another tab/window
  const onStorage = (e) => {
    if (e.key === 'auth_verify' && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        setIsSignup(false);
        if (data?.email) setEmail(data.email);
        setPassword("");
        setName("");
        setConfirmPassword("");
        if (formRef.current) formRef.current.reset();
        toast.success(data?.message || 'Your email is verified. Please login.');
      } catch(error) {
console.log('Error parsing auth_verify data from storage event', error);
      }
    }
  };
  window.addEventListener('storage', onStorage);
  // Also handle flag already in localStorage (same tab redirect case)
  try {
    const existing = localStorage.getItem('auth_verify');
    if (existing) {
      const data = JSON.parse(existing);
      setIsSignup(false);
      if (data?.email) setEmail(data.email);
      setPassword("");
      setName("");
      setConfirmPassword("");
      if (formRef.current) formRef.current.reset();
      toast.success(data?.message || 'Your email is verified. Please login.');
      localStorage.removeItem('auth_verify');
    }
  } catch(error) {
console.log('Error parsing auth_verify data from storage event', error);
      }
  return () => window.removeEventListener('storage', onStorage);
}, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isSignup) {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user/register`, {
          username: name,
          email,
          password,
          confirmPassword,
        });
     
        toast.success(res.data.message || 'Registered successfully. Please verify your email.');
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user/login`, {
          email,
          password,
        }, { withCredentials: true });
           console.log(res);
        toast.success(res.data.message || 'Logged in successfully.');
        navigate('/');
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || 'Something went wrong, Please try again';
      if (status === 403) {
        toast.error('Please verify your email before logging in. Check your inbox.');
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-5 bg-white shadow-md rounded-lg">
      <Link to="/" >  <div className="bg-[#0066B3]  hover:bg-[#F05922] cursor-pointer text-white rounded-full ml-auto w-5 pr-6 pl-2 pt-2 pb-2 hover:[">
      <FaTimes  /></div></Link>
        <h2 className="text-xl font-semibold mb-4 text-center logo-gradient">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-3" ref={formRef}>
          {isSignup && (
            <>
              <div>
                <input name="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" className="w-full p-2 border rounded" required />
              </div>
            </>
          )}
          <div>
            <input name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <input name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" required />
          </div>
          {isSignup &&( <div>
                <input name="confirmPassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm Password" type="password" className="w-full p-2 border rounded" required />
              </div>)}
         
          <button type="submit" className="w-full p-2 bg-[#0066B3] hover:bg-[#F05922] text-white rounded">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="text-center my-3">OR</div>
        <button className="w-full flex items-center gap-2 p-2 bg-red-500 hover:bg-[#b92b2b] text-white rounded" onClick={() => window.location.href = `${import.meta.env.VITE_SERVERAP || 'http://localhost:5000'}/auth/google`}>
          <FcGoogle size={20} /> Sign in with Google
        </button>
        <button className="w-full flex items-center gap-2 mt-2 p-2 bg-blue-800 hover:bg-[#2828ac] text-white rounded">
          <FaFacebook size={20} /> Sign in with Facebook
        </button>
        <p className="text-center mt-4 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"} {" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AuthForm;
