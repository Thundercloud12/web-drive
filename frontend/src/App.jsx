import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";

// React Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout Components
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import AdminLayout from "./pages/admin/AdminLayout";

// Auth Pages
import Login from "./pages/login";
import Signup from "./pages/signup";
import AdminKey from "./pages/AdminLogin";

// Home
import HomePage from "./pages/HomePage";

// User Dashboard
import Dashboard from "./pages/Dashboard";
import BookUser from "./pages/BookUser";

// Admin Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import BookAdmin from "./pages/BookAdmin";
import IssueAdmin from "./pages/IsssueAdmin";
import UserVerification from "./pages/UserVerification";
import CloseIssue from "./pages/CloseIssue";

// Error Page
import NotFound from "./pages/NotFound";

// Secure Routing
import { ThemeProvider } from "./context/ThemeContext";
import UserLayout from "./pages/UserLayout";
import AdminRoute from "./components/AdminRoute.jsx";
import UserRoute from "./components/UserRoute.jsx";

// Redux
import { useDispatch } from "react-redux";
import { loginSuccess } from "./slices/authSlice";
import CurrentRental from "./pages/CurrentRental.jsx";
import AdminSignup from "./pages/AdminSignup.jsx";

function App() {
  const dispatch = useDispatch();

  // 🔁 Sync user from localStorage to Redux
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch(loginSuccess(userData));
    }
  }, [dispatch]);

  // 🔧 Modal State Management
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setPasswordError("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4300/api/v1/users/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setPasswordError("");
        setShowChangePasswordModal(false);
      } else {
        toast.error("Error in changing password");
      }
    } catch (error) {
      console.log("Error in changing password", error);
      toast.error("Error in changing password");
    }
  };

  return (
    <>
      <ThemeProvider>
        <Navbar setShowChangePasswordModal={setShowChangePasswordModal} />
        <div className="pt-20">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login/:id" element={<AdminKey />} />
            <Route path="/admin-signup" element={<AdminSignup/>} />

            {/* User Protected Routes */}
            <Route element={<UserRoute role="user" />}>
              <Route path="/user" element={<UserLayout />}>
                <Route path="user-dashboard/:id" element={<Dashboard />} />
                <Route path="book-user/:id" element={<BookUser />} />
                <Route path="my-rental/:id" element={<CurrentRental />} />
              </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="books" element={<BookAdmin />} />
                <Route path="issue-requests" element={<IssueAdmin />} />
                <Route path="user-verification" element={<UserVerification />} />
                <Route path="close-issue" element={<CloseIssue />} />
              </Route>
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer position="top-center" autoClose={3000} pauseOnHover theme="colored" />
      </ThemeProvider>

      {/* 🔒 Change Password Modal */}
      <input type="checkbox" id="change-password-modal" className="modal-toggle" checked={showChangePasswordModal} readOnly />
      <div className={`modal ${showChangePasswordModal ? "modal-open" : ""}`}>
        <div className="modal-box font-[Oxygen]">
          <h3 className="font-bold text-lg mb-4">Change Password</h3>

          <label className="label">
            <span className="label-text">Old Password</span>
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input input-bordered w-full mb-2"
          />

          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-bordered w-full mb-2"
          />

          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}

          <div className="modal-action">
            <label className="btn" onClick={() => setShowChangePasswordModal(false)}>Cancel</label>
            <label className="btn btn-primary" onClick={handlePasswordChange}>Submit</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
