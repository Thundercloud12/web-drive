import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // adjust path as per your project

const Footer = () => {
  const { darkMode } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative py-10 px-6 font-['Oxygen'] border-t 
        ${darkMode ? "bg-[#0d1117] text-[#c9d1d9] border-[#21262d]" : "bg-gray-100 text-gray-800 border-gray-300"}
      `}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-sm md:text-base">
        {/* About */}
        <div>
          <h2 className={`font-bold text-xl mb-2 ${darkMode ? "text-[#58a6ff] drop-shadow-[0_0_4px_#58a6ff]" : "text-blue-600"}`}>
            📚 Library App
          </h2>
          <p className={darkMode ? "text-[#8b949e]" : "text-gray-600"}>
            Explore the world of knowledge. Rent and read books with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={`font-semibold mb-2 ${darkMode ? "text-[#58a6ff] drop-shadow-[0_0_3px_#58a6ff]" : "text-blue-600"}`}>
            Quick Links
          </h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline hover:text-blue-400">Home</Link></li>
            <li><Link to="/login" className="hover:underline hover:text-blue-400">Login</Link></li>
            <li><Link to="/signup" className="hover:underline hover:text-blue-400">Signup</Link></li>
            <li><Link to="/admin-login" className="hover:underline hover:text-blue-400">Admin Login</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className={`font-semibold mb-2 ${darkMode ? "text-[#58a6ff] drop-shadow-[0_0_3px_#58a6ff]" : "text-blue-600"}`}>
            Contact
          </h3>
          <p className={darkMode ? "text-[#8b949e]" : "text-gray-600"}>support@libraryapp.com</p>
          <div className="flex gap-4 mt-3">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub className={`text-xl transition duration-300 ${darkMode ? "hover:text-[#6e5494]" : "hover:text-black"}`} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className={`text-xl transition duration-300 ${darkMode ? "hover:text-[#0077b5]" : "hover:text-blue-800"}`} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className={`text-xl transition duration-300 ${darkMode ? "hover:text-[#1da1f2]" : "hover:text-sky-500"}`} />
            </a>
          </div>
        </div>
      </div>

      <div className={`text-center text-xs mt-10 ${darkMode ? "text-[#6e7681]" : "text-gray-500"}`}>
        &copy; {new Date().getFullYear()} Library App. All rights reserved.
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 p-3 rounded-full shadow-md z-50 transition
          ${darkMode ? "bg-[#161b22] text-white hover:bg-[#21262d] hover:drop-shadow-[0_0_10px_#00FFFF]" 
                     : "bg-white text-black hover:bg-gray-200 hover:shadow-lg"}
        `}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </motion.footer>
  );
};

export default Footer;
