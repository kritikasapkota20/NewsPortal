// src/api/axios.js
import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // adjust for your backend URL
  withCredentials: true, // send cookies (token & refreshToken)
});

// Interceptor for handling expired tokens
axiosInstance.interceptors.response.use(
  (response) => response, // if success, just return
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, try refresh once
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/api/users/refresh"); // refresh token endpoint
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // redirect to login if refresh failed
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
