// src/pages/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#4a3628] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* About / Logo */}
        <div>
          <h2 className="font-bold text-lg mb-2">📚 Library App</h2>
          <p>Explore the world of knowledge. Rent and read books with ease.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/signup" className="hover:underline">Signup</Link></li>
            <li><Link to="/admin-login" className="hover:underline">Admin Login</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p>Email: support@libraryapp.com</p>
          <div className="flex gap-4 mt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-xl hover:text-gray-300" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-xl hover:text-gray-300" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-xl hover:text-gray-300" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs mt-6 text-gray-300">
        &copy; {new Date().getFullYear()} Library App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
