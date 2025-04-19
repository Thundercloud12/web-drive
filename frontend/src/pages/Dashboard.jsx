import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { useTheme } from "../context/ThemeContext"; // make sure the path is correct

const Dashboard = () => {
  const { darkMode } = useTheme();

  const [userInfo, setUserInfo] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("user_id")
      const res = await axios.get(`http://localhost:4300/api/v1/users/obtain-user-information/${userId}`, { withCredentials: true });
      console.log(res)
      setUserInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchUserRentals = async () => {
    try {
      const res = await axios.get("/users/my-rentals", { withCredentials: true });
      setRentals(res.data.rentals);
    } catch (err) {
      console.error("Failed to fetch rentals", err);
    } finally {
      setLoadingRentals(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserRentals();
  }, []);

  const statusColors = {
    pending: "#facc15",   // yellow-400
    approved: "#60a5fa",  // blue-400
    collected: "#a78bfa", // purple-400
    returned: "#34d399",  // green-400
    notreq: "#9ca3af",    // gray-400
  };

  const durationData = rentals.map((r) => {
    const start = new Date(r.collectedDate);
    const end = r.returnedDate ? new Date(r.returnedDate) : new Date();
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return {
      name: r.book?.title?.slice(0, 12) || "Untitled",
      duration: durationDays,
    };
  });

  const statusData = rentals.reduce((acc, r) => {
    const status = r.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(statusData).map((key) => ({
    name: key,
    value: statusData[key],
    color: statusColors[key] || "#fff",
  }));

  return (
    <div className={`p-6 min-h-screen font-['Oxygen'] transition duration-300
      ${darkMode ? "bg-gradient-to-br from-[#1f1f1f] to-[#121212] text-white" : "bg-gray-100 text-gray-900"}
    `}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-6"
      >
        👤 Your Dashboard
      </motion.h2>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`mb-6 p-5 rounded-lg shadow-lg 
          ${darkMode ? "bg-[#2a2a2a]" : "bg-white border border-gray-200"}
        `}
      >
        <h3 className="text-xl font-semibold mb-4">🧾 User Info</h3>
        {loadingUser ? (
          <p>Loading user information...</p>
        ) : userInfo ? (
          <div className="flex items-center gap-6">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.fullname}`}
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-gray-600"
            />
            <div>
              <p><strong>Name:</strong> {userInfo.fullname}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Fees Receipt No:</strong> {userInfo.feesReceiptNo}</p>
              <p><strong>Verified:</strong> {userInfo.isVerified ? "✅ Yes" : "❌ No"}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-400">Unable to load user info.</p>
        )}
      </motion.div>


      {/* Rental History */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`${darkMode ? "bg-[#2a2a2a]" : "bg-white border border-gray-200"} p-5 rounded-lg shadow-lg`}
      >
        <h3 className="text-xl font-semibold mb-4">📖 Your Rentals</h3>
        {loadingRentals ? (
          <p>Loading your rentals...</p>
        ) : rentals.length === 0 ? (
          <p className="text-gray-400">You have not rented any books yet.</p>
        ) : (
          <ul className="space-y-4">
            {rentals.map((rental) => (
              <li
                key={rental._id}
                className={`pb-3 ${darkMode ? "border-b border-gray-700" : "border-b border-gray-300"} last:border-none`}
              >
                <p><strong>Book:</strong> {rental.book?.title || "Untitled"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: statusColors[rental.status] || "#fff" }}>
                    {rental.status}
                  </span>
                </p>
                <p>
                  <strong>Requested:</strong>{" "}
                  {new Date(rental.requestDate).toLocaleDateString()}
                </p>
                {rental.collectedDate && (
                  <p>
                    <strong>Collected:</strong>{" "}
                    {new Date(rental.collectedDate).toLocaleDateString()}
                  </p>
                )}
                {rental.returnedDate && (
                  <p>
                    <strong>Returned:</strong>{" "}
                    {new Date(rental.returnedDate).toLocaleDateString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
