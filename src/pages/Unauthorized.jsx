import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        401 - Unauthorized
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}
