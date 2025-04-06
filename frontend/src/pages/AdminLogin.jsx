import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"; // ✅ FIXED


function AdminKey() {
  const [orgKey, setOrgKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4300/api/v1/users/login/admin",
        { orgKey },
        { withCredentials: true }
      );

      if (response.data.token) {
        // Optional: Save token if needed
        localStorage.setItem("admin_token", response.data.token);

        navigate("/admin-dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid key, try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-white">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-[#161b22] rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-center text-2xl font-bold mb-6">
          🔐 Enter Admin Key
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="password"
          value={orgKey}
          onChange={(e) => setOrgKey(e.target.value)}
          placeholder="Enter Organization Key"
          className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:outline-none focus:border-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full mt-4 p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Verify Key
        </button>
      </form>
    </div>
  );
}

export default AdminKey;
