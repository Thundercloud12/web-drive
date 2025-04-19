import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import notFoundAnim from "../assets/reading.json"; // 👉 Place your 404 Lottie JSON here
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // Importing useTheme

const NotFound = () => {
  const { darkMode } = useTheme(); // Access darkMode state from context

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-6 text-center font-['Oxygen'] transition-all duration-500 ${
        darkMode ? "bg-[#2c2c2c] text-white" : "bg-[#f8efe6] text-[#4a3628]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[300px] sm:w-[400px] mb-6"
      >
        <Lottie animationData={notFoundAnim} loop={true} />
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-6xl font-bold mb-4"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg mb-6"
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link
          to="/"
          className={`px-6 py-2 rounded-lg transition ${
            darkMode ? "bg-[#4a3628] text-white hover:bg-[#322317]" : "bg-[#4a3628] text-white hover:bg-[#322317]"
          }`}
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
