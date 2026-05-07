import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  // ✅ Get token from URL (FIXED)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const urlToken = query.get("token");

    console.log("TOKEN FROM URL:", urlToken); // 🔍 debug

    if (!urlToken) {
      setMessage("Invalid or missing reset token");
    } else {
      setToken(urlToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid reset link");
      return;
    }

    try {
      console.log("SENDING TOKEN:", token); // 🔍 debug

      const res = await axios.post(
        "https://attendance-snowy-alpha.vercel.app/auth/reset-password",
        {
          token,
          password,
        },
      );

      setMessage(res.data.message);

      // ✅ Redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.log(error.response); // 🔍 debug

      setMessage(error?.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Reset Password
        </h2>

        {/* ❌ If token invalid */}
        {!token ? (
          <p className="text-red-500 text-center">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}

        {message && token && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
