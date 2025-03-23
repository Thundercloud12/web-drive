import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';
import logo from "../assets/logo.png";

const Navbar = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuth(false);
      navigate('/'); 
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-[#e7f0e4] to-[#cde7d6] shadow-md">
      <div className="navbar w-full px-6">
        <div className="navbar-start flex items-center">
          <img src={logo} alt="Logo" className="h-16 w-24 mr-4" />

          <div className="dropdown">
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-md shadow-md mt-3 w-52 p-2">
              <li><a className="text-gray-700 hover:text-green-700">Dashboard</a></li>
              <li><a className="text-gray-700 hover:text-green-700">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li> <Link
                className="text-gray-700 hover:text-green-700"
                to="/"
              > HomePage </Link></li>
            <li><a className="text-gray-700 hover:text-green-700">Support</a></li>
          </ul>
        </div>

        <div className='flex navbar-end'>
          {isAuth ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-green-700 text-green-700 rounded-md hover:bg-green-700 hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                className="px-4 py-2 border border-green-700 text-green-700 rounded-md hover:bg-green-700 hover:text-white transition mr-4"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
