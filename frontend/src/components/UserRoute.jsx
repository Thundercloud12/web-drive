import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

const UserRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  return isAuthenticated && role === "user" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserRoute;
