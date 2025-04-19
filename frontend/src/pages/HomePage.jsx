import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import heroImage from "../assets/hero_lib.png";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import readingAnimation from "../assets/navv.json";
import { useTheme } from "../context/ThemeContext"; // ✅ import useTheme hook

export default function HomePage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // ✅ use context hook
  const [stats, setStats] = useState({ books: 0, users: 0, rentals: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (token && role) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        const userId = localStorage.getItem("user_id");
        navigate(`user/user-dashboard/${userId}`);
      }
    }
  }, [token, role, navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:4300/api/v1/stats")
      .then((res) => {
        setStats(res.data);
        setLoadingStats(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats", err);
        setLoadingStats(false);
      });
  }, []);

  const theme = darkMode
    ? "bg-[#0d1117] text-[#c9d1d9]"
    : "bg-gradient-to-r from-[#fdf5e6] via-[#f2d8c2] to-[#deb887] text-black";

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme} font-['Oxygen']`}>
      <div className="container mx-auto px-6 py-10 flex flex-col items-center">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center w-full justify-between gap-10">
          {/* Left Text Block */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#ffa07a]">
                Library Management
              </span>{" "}
              System
            </h1>
            <p className="text-lg sm:text-xl text-[#a0a0a0] mb-6">
              Effortlessly track, manage, and borrow your favorite books.
            </p>
            <Link
              to="/signup"
              className="px-7 py-3 bg-[#ff6b6b] hover:bg-[#e05555] text-white rounded-xl shadow-md hover:shadow-[0_0_15px_#ff6b6b] transition duration-300 font-medium"
            >
              🚀 Get Started
            </Link>
          </motion.div>

          {/* Lottie Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-72 md:w-80 mx-auto md:mx-0"
          >
            <Lottie animationData={readingAnimation} loop={true} />
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <img
              src={heroImage}
              alt="Library Hero"
              className="w-full object-contain rounded-xl"
              style={{ boxShadow: "none", border: "none", backgroundColor: "transparent" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
