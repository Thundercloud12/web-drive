import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [rentals, setRentals] = useState([]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/users/me", {
        withCredentials: true,
      });
      setUserInfo(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  const fetchUserRentals = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/users/my-rentals", {
        withCredentials: true,
      });
      setRentals(res.data.rentals);
    } catch (err) {
      console.error("Failed to fetch rentals", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserRentals();
  }, []);

  const statusColors = {
    pending: "text-yellow-600",
    approved: "text-blue-600",
    collected: "text-purple-600",
    returned: "text-green-600",
    notreq: "text-gray-500",
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#1f1f1f] to-[#121212] text-white">
      <h2 className="text-3xl font-bold mb-4">📚 Welcome to Your Dashboard</h2>

      {userInfo && (
        <div className="mb-6 bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">👤 User Info</h3>
          <p><strong>Name:</strong> {userInfo.fullname} {userInfo.surname}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Fees Receipt No:</strong> {userInfo.feesReceiptNo}</p>
        </div>
      )}

      <div className="bg-[#2a2a2a] p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">📖 Your Rentals</h3>
        {rentals.length === 0 ? (
          <p>No books issued yet.</p>
        ) : (
          <ul className="space-y-4">
            {rentals.map((rental) => (
              <li key={rental._id} className="border-b border-gray-600 pb-2">
                <p><strong>Book:</strong> {rental.book?.title || "Unknown Book"}</p>
                <p><strong>Status:</strong> <span className={statusColors[rental.status]}>{rental.status}</span></p>
                <p><strong>Requested:</strong> {new Date(rental.requestDate).toLocaleDateString()}</p>
                {rental.collectedDate && (
                  <p><strong>Collected:</strong> {new Date(rental.collectedDate).toLocaleDateString()}</p>
                )}
                {rental.returnedDate && (
                  <p><strong>Returned:</strong> {new Date(rental.returnedDate).toLocaleDateString()}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
