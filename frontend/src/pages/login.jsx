import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { setAuth } from "../slices/authSlice";

function Login() {
  const { darkMode } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmit(true);
  

  try {
    const response = await axios.post(
      "http://localhost:4300/api/v1/users/login",
      { username, password },
      { withCredentials: true }
    );
    console.log(response);
    
    const { role, token, user_id} = response.data;
    

    if (token) {
      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);

      // Update Redux store
      dispatch(setAuth({ user: null, token, role }));

      toast.success("Login successful!");

      setTimeout(() => {
        if (role === "admin") {
          navigate(`/admin-login/${user_id}`);
        } else {
          navigate(`/user/user-dashboard/${user_id}`);
        }
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    
    toast.error(err.response?.data?.msg || "Login failed, try again!");
  } finally {
    setSubmit(false);
  }
};



  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 transition-colors duration-500 font-['Oxygen'] ${
        darkMode
          ? "bg-[#0d1117] text-white"
          : "bg-gradient-to-r from-[#e8d9c4] to-[#b8926b] text-black"
      }`}
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative w-full max-w-md p-8 rounded-2xl border shadow-lg ${
          darkMode
            ? "bg-[#161b22]/90 border-[#30363d] backdrop-blur-lg shadow-[0_0_20px_#58a6ff40]"
            : "bg-white/90 border-[#d5b99b] backdrop-blur-lg shadow-xl"
        }`}
      >
        <h2 className="text-center text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-center mb-6 text-sm">
          Log in to explore your library universe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
              className={`peer w-full px-4 pt-5 pb-2 rounded-lg border focus:outline-none transition-all duration-300 ${
                darkMode
                  ? "bg-[#0d1117] text-white border-[#30363d] focus:ring-2 focus:ring-[#58a6ff] shadow-inner"
                  : "bg-white text-black border-[#d5b99b] focus:ring-2 focus:ring-[#b58b63]"
              }`}
            />
            <label
              className={`absolute left-4 top-2 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 ${
                darkMode ? "text-[#58a6ff]" : "text-[#3c2b1e]"
              }`}
            >
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              className={`peer w-full px-4 pt-5 pb-2 pr-10 rounded-lg border focus:outline-none transition-all duration-300 ${
                darkMode
                  ? "bg-[#0d1117] text-white border-[#30363d] focus:ring-2 focus:ring-[#58a6ff] shadow-inner"
                  : "bg-white text-black border-[#d5b99b] focus:ring-2 focus:ring-[#b58b63]"
              }`}
            />
            <label
              className={`absolute left-4 top-2 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 ${
                darkMode ? "text-[#58a6ff]" : "text-[#3c2b1e]"
              }`}
            >
              Password
            </label>
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-[50%] translate-y-[-50%] text-gray-500 cursor-pointer"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="text-right -mt-4">
            <Link
              to="/forgot-password"
              className={`text-xs underline ${
                darkMode ? "text-[#58a6ff] hover:text-[#79c0ff]" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: submit ? 1 : 1.03 }}
            disabled={submit}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 ${
              submit
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : darkMode
                ? "bg-[#238636] hover:bg-[#2ea043] text-white shadow-md shadow-green-500/20"
                : "bg-[#6b4f37] hover:bg-[#4a3628] text-white shadow-md"
            }`}
          >
            {submit ? "Logging In..." : "Log In"}
          </motion.button>
        </form>

        <p className="text-xs text-center mt-5 text-gray-400">
          📩 Check your email for login credentials after verification.
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
