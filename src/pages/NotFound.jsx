import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      {/* 404 Number */}
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-xl animate-pulse">
        404
      </h1>

      {/* Message */}
      <h2 className="text-3xl md:text-4xl font-bold mt-4">Page Not Found</h2>

      <p className="text-gray-300 text-center mt-3 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Illustration */}
      <div className="mt-8 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      {/* Button */}
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-blue-600 rounded-lg text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200"
      >
        Go Back to Home
      </Link>

      {/* Footer Text */}
      <p className="mt-6 text-gray-500 text-sm">
        — Ascentware Employee Portal —
      </p>
    </div>
  );
}
