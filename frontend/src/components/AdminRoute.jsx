import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

const AdminRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
