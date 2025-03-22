import React from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { FiBarChart2, FiCreditCard, FiMenu } from 'react-icons/fi'; // Icons

const Layout = () => {
  const { user_id } = useParams();
  console.log("Rendering Layout Component for user:", user_id);

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gradient-to-r from-[#e7f0e4] to-[#cde7d6]">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="flex items-center justify-between bg-white shadow-md p-4 lg:hidden">
        <h1 className="text-lg font-bold text-gray-700">Expense Tracker</h1>
        <label htmlFor="my-drawer-2" className="cursor-pointer">
          <FiMenu size={28} className="text-gray-700" />
        </label>
      </div>

      <div className="drawer-content flex flex-col p-4 mt-20">
        <Outlet />
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <ul className="menu bg-white text-gray-900 shadow-lg min-h-full w-80 p-6 rounded-r-xl">
          <li className="text-xl font-bold text-gray-700 mb-6">Expense Tracker</li>

          <li className="hover:bg-gray-200 rounded-lg">
            <Link to={`/dashboard/${user_id}`} className="flex items-center gap-4 p-3">
              <FiBarChart2 size={20} /> Overview
            </Link>
          </li>

          <li className="hover:bg-gray-200 rounded-lg">
            <Link to={`/dashboard/${user_id}/expense`} className="flex items-center gap-4 p-3">
              <FiCreditCard size={20} /> Expense
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Layout;
