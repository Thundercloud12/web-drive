import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  ClipboardCheck,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx"; 

const UserLayout = () => {
  const { darkMode } = useTheme(); 
  const userId = localStorage.getItem("user_id")

  return (
    <div
      className={`flex min-h-screen font-[Oxygen] transition-all duration-300 ${
        darkMode ? "bg-[#0d1117] text-white" : "bg-[#f4f4f4] text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div className="drawer lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content flex flex-col">
    {/* Page content here */}
    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
      Open drawer
    </label>
    <main className="flex-1 p-6 overflow-y-auto">
      <Outlet />
    </main>
  </div>

  <div className="drawer-side">
    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
    
    <aside
      className={`w-80 min-h-full p-5 shadow-lg border-r transition-all duration-300 ${
        darkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-300"
      }`}
    >
      <h2
        className={`text-2xl font-bold tracking-tight mb-6 ${
          darkMode ? "text-yellow-400" : "text-[#4a3628]"
        }`}
      >
        📚 User Panel
      </h2>

      <nav className="flex flex-col gap-2">
        <NavItem to={`/user/user-dashboard/${userId}`} icon={<LayoutDashboard size={20} />}>
          Dashboard
        </NavItem>
        <NavItem to={`/user/book-user/${userId}`} icon={<BookOpen size={20} />}>
          Books
        </NavItem>
        <NavItem to={`/user/my-rental/${userId}`} icon={<BookOpen size={20} />}>
          Current Ongoing Rentals
        </NavItem>
      </nav>
    </aside>
  </div>
</div>


      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

// Reusable NavItem with theme support
const NavItem = ({ to, icon, children }) => {
  const { darkMode } = useTheme(); // ✅ use theme inside NavItem too

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300
        ${
          isActive
            ? darkMode
              ? "bg-[#238636] text-white font-semibold"
              : "bg-[#dbe9c7] text-[#17451a] font-semibold"
            : darkMode
            ? "text-gray-400 hover:bg-[#2c2c2c] hover:text-white"
            : "text-[#4a3628] hover:bg-[#e6f1dd] hover:text-black"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
};

export default UserLayout;
