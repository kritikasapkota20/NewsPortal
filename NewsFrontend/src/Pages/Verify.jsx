import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, success: false, message: "Verifying...", email: "" });

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/user/verify/${token}`);
        const msg = res.data.message || 'You are registered! Please login to continue.';
        const email = res.data.email || '';
        setStatus({ loading: false, success: true, message: msg, email });
        // Notify any open tabs/windows to switch to login and clear fields
        try {
          localStorage.setItem('auth_verify', JSON.stringify({ email, message: msg, at: Date.now() }));
        } catch {}
        const params = new URLSearchParams({ verified: '1', email });
        navigate(`/AuthForm?${params.toString()}`, { replace: true, state: { fromVerify: true, clear: true, message: msg, email } });
      } catch (err) {
        const msg = err?.response?.data?.message || 'Invalid or expired verification link';
        setStatus({ loading: false, success: false, message: msg, email: '' });
      }
    };
    if (token) verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
        {status.loading ? (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-700">Verifying your email...</p>
          </>
        ) : status.success ? (
          <>
            <p className="text-gray-600 mb-4">Redirecting you to login…</p>
            <Link className="inline-block px-4 py-2 bg-[#0066B3] text-white rounded hover:bg-[#F05922]" to={{ pathname: "/AuthForm", search: `?verified=1&email=${encodeURIComponent(status.email)}` }} state={{ fromVerify: true, clear: true, email: status.email }}>Go to Login</Link>
          </>
        ) : (
          <>
            <div className="text-red-600 text-4xl mb-2">✕</div>
            <h2 className="text-xl font-semibold mb-2">Verification failed</h2>
            <p className="text-gray-600 mb-4">{status.message}</p>
            <Link className="inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900" to="/AuthForm">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;