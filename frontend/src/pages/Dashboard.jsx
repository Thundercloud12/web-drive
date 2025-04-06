import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/users/me", {
        withCredentials: true,
      });
      setUserInfo(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchUserRentals = async () => {
    try {
      const res = await axios.get("/users/my-rentals", {
        withCredentials: true,
      });
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
    pending: "text-yellow-400",
    approved: "text-blue-400",
    collected: "text-purple-400",
    returned: "text-green-400",
    notreq: "text-gray-400",
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#1f1f1f] to-[#121212] text-white">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-6"
      >
        👤 Your Dashboard
      </motion.h2>

      {/* User Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 bg-[#2a2a2a] p-5 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-3">🧾 User Info</h3>
        {loadingUser ? (
          <p>Loading user information...</p>
        ) : userInfo ? (
          <div className="space-y-1">
            <p><strong>Name:</strong> {userInfo.fullname} {userInfo.surname}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Fees Receipt No:</strong> {userInfo.feesReceiptNo}</p>
            <p><strong>Verified:</strong> {userInfo.isVerified ? "✅ Yes" : "❌ No"}</p>
          </div>
        ) : (
          <p className="text-red-400">Unable to load user info.</p>
        )}
      </motion.div>

      {/* Rental History Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#2a2a2a] p-5 rounded-lg shadow-lg"
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
                className="border-b border-gray-700 pb-3 last:border-none"
              >
                <p><strong>Book:</strong> {rental.book?.title || "Untitled"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={statusColors[rental.status] || "text-white"}>
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
