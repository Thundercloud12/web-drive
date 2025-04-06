import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import heroImage from "../assets/hero_lib.png";
import axios from "../utils/axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    // Optional: persist dark mode across reloads
    return localStorage.getItem("darkMode") === "true";
  });

  const [stats, setStats] = useState({ books: 0, users: 0, rentals: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (token && role) {
      navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
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

  const toggleDark = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode); // persist preference
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-[#f4e1c6] via-[#d3b89a] to-[#a87c62] text-black"
      } min-h-screen transition-colors duration-500`}
    >
      <div className="container mx-auto px-6 py-10 flex flex-col items-center">
        {/* Toggle */}
        <div className="flex justify-end w-full mb-4">
          <button
            onClick={toggleDark}
            className="px-4 py-2 rounded-full border hover:scale-105 duration-300 shadow-lg bg-white/10 text-sm backdrop-blur-lg"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-center w-full justify-between">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
              Library Management System
            </h1>
            <p className="text-lg sm:text-xl mb-6">
              Effortlessly track, manage, and borrow your favorite books.
            </p>
            <Link
              to="/signup"
              className="px-6 py-3 bg-[#8b5e3b] text-white rounded-lg shadow-lg hover:bg-[#6d4830] transition"
            >
              🚀 Get Started
            </Link>
          </div>

          {/* Image */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src={heroImage}
              alt="Library Hero"
              className={`max-w-md rounded-xl shadow-2xl p-2 transition-opacity duration-500 ${
                darkMode ? "bg-white" : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-center">
          {["books", "users", "rentals"].map((key, index) => (
            <div
              key={index}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20"
            >
              <h3 className="text-xl font-bold">
                {key === "books" ? "📚 Books" : key === "users" ? "👥 Users" : "📦 Rentals"}
              </h3>
              <p className="text-2xl font-semibold">
                {loadingStats ? "Loading..." : stats[key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
