import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // If no token, redirect to unauthorized page
  return token ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
