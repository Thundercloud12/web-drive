import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ import useParams
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import adminAnim from "../assets/admin-lock.json";
import { useTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { setAuth } from "../slices/authSlice.js";

function AdminKey() {
  const [orgKey, setOrgKey] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const { id } = useParams(); // ✅ get admin id from URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:4300/api/v1/users/login/admin/${id}`, // ✅ pass ID to backend
        { orgKey },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("role", "admin");

        dispatch(setAuth({ user: null, token: response.data.token, role: "admin" }));

        toast.success("✅ Verified! Redirecting...");
        setTimeout(() => navigate("/admin/dashboard"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Invalid key!");
    }
  };

  return (
    <div
      className={
        darkMode
          ? "flex items-center justify-center min-h-screen bg-[#0d1117] text-white"
          : "flex items-center justify-center min-h-screen bg-white text-black"
      }
      style={{ fontFamily: "'Oxygen', sans-serif" }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className={
          darkMode
            ? "p-8 bg-[#161b22] rounded-2xl shadow-2xl w-full max-w-sm"
            : "p-8 bg-gray-100 rounded-2xl shadow-2xl w-full max-w-sm"
        }
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 mx-auto mb-4">
          <Lottie animationData={adminAnim} loop />
        </div>

        <h2 className="text-center text-2xl font-bold mb-6">🔐 Admin Access</h2>

        <input
          type="password"
          value={orgKey}
          onChange={(e) => setOrgKey(e.target.value)}
          placeholder="Enter Organization Key"
          className={
            darkMode
              ? "w-full p-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-400"
              : "w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
          }
          required
        />

        <button
          type="submit"
          className="w-full mt-4 p-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold rounded-lg"
        >
          Verify Key
        </button>
      </motion.form>
    </div>
  );
}

export default AdminKey;
