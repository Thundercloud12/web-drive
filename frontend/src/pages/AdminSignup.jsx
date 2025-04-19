import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

function AdminSignup() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submit, setSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setSubmit(true);

    try {
      await axios.post("http://localhost:4300/api/v1/users/admin-signup", {
        fullname,
        username,
        email,
        password,
      });

      toast.success("Admin signup successful! Please check your email!");
      navigate("/login");
    } catch (err) {
      console.log(err);
      
      toast.error(err.response?.data?.message || "Signup failed. Try again!");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 font-['Oxygen'] ${
        darkMode
          ? "bg-gradient-to-tr from-[#1f1f1f] to-[#111] text-white"
          : "bg-gradient-to-tr from-[#e7dac7] to-[#c2a27a] text-black"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border ${
          darkMode ? "bg-[#1b1b1b] border-[#333]" : "bg-white border-[#c2a27a]"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-2">Admin Signup</h2>
        <p className="text-center mb-6 text-sm opacity-80">Create an admin account 🔐</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput label="Name" value={fullname} onChange={setFullname} darkMode={darkMode} />
          <FloatingInput label="Username" value={username} onChange={setUsername} darkMode={darkMode} />
          <FloatingInput label="Email" type="email" value={email} onChange={setEmail} darkMode={darkMode} />
          <FloatingInput label="Password" type="password" value={password} onChange={setPassword} darkMode={darkMode} />
          <FloatingInput label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} darkMode={darkMode} />

          <button
            type="submit"
            disabled={submit}
            className={`btn w-full font-semibold ${
              submit
                ? "bg-gray-400 text-white cursor-not-allowed"
                : darkMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-[#4a3628] text-white hover:bg-[#322317]"
            }`}
          >
            {submit ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

const FloatingInput = ({ label, type = "text", value, onChange, darkMode }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className={`label-text ${darkMode ? "text-white" : "text-[#4a3628]"}`}>{label}</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={`input input-bordered w-full ${
          darkMode ? "bg-[#2a2a2a] text-white border-[#444]" : "bg-white text-black"
        }`}
      />
    </div>
  );
};

export default AdminSignup;
