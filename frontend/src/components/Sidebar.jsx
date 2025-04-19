import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ✅ import the global theme hook

const Sidebar = () => {
  const { darkMode } = useTheme(); // ✅ grab the darkMode state

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
     ${
       isActive
         ? darkMode
           ? "bg-[#1f1f1f] text-yellow-400 font-semibold shadow-lg"
           : "bg-[#f1e2d0] text-[#4a3628] font-semibold shadow"
         : darkMode
         ? "text-gray-400 hover:bg-[#2c2c2c] hover:text-white"
         : "text-[#4a3628] hover:bg-[#e0c9ab] hover:text-black"
     }`;

  return (
    <aside
      className={`w-64 min-h-screen p-6 border-r shadow-2xl font-[Oxygen] transition-all duration-300 ${
        darkMode
          ? "bg-[#0d1117] text-white border-gray-700"
          : "bg-[#f9f5f0] text-[#4a3628] border-[#d6baa4]"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-10 tracking-tight ${
          darkMode ? "text-yellow-400" : "text-[#4a3628]"
        }`}
      >
        📚 Admin Panel
      </h2>
      <nav className="space-y-3 text-base">
        <NavLink to="/admin/dashboard" className={linkClasses}>
          <span>📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/with-rentals" className={linkClasses}>
          <span>📦</span> Users With Rentals
        </NavLink>
        <NavLink to="/admin/unverified" className={linkClasses}>
          <span>🚫</span> Unverified Users
        </NavLink>
        <NavLink to="/admin/book-list" className={linkClasses}>
          <span>📚</span> Book List
        </NavLink>
        <NavLink to="/admin/pending-requests" className={linkClasses}>
          <span>🕓</span> Pending Requests
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
