import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    try {
      const response = await axios.post(
        "http://localhost:4300/api/v1/users/login",
        { username, password },
        { withCredentials: true } // to send/receive cookies
      );

      if (response.data.token) {
        const userId = response.data.user_id;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("role", response.data.role);

        toast.success("Login successful!");

        setTimeout(() => {
          if (response.data.role === "admin") {
            navigate("/admin-login");
          } else {
            navigate(`/dashboard/${userId}`);
          }
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Login failed, try again!");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-[#e7dac7] to-[#c2a27a] mt-10 w-full h-full">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-[#c2a27a]">
        <h2 className="text-center text-3xl font-serif font-bold text-[#4a3628] mb-4">
          Log Into your Account
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Join the library and explore a world of knowledge.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-[#c2a27a]"
              placeholder="Enter the username sent via email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-[#c2a27a]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              submit
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-[#6b4f37] text-white hover:bg-[#4a3628]"
            }`}
            disabled={submit}
          >
            {submit ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          📩 Credentials were sent to your email after verification.
        </p>
      </div>
    </div>
  );
}

export default Login;
