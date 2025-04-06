import React, { useEffect, useState } from 'react';
import axios from "../utils/axios"; // ✅ FIXED


const AdminDashboard = () => {
  const [usersWithRentals, setUsersWithRentals] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);

  useEffect(() => {
    fetchUsersWithRentals();
    fetchUnverifiedUsers();
  }, []);

  const fetchUsersWithRentals = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/users/admin/with-rentals", {
        withCredentials: true,
      });
      setUsersWithRentals(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch rentals", err);
    }
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4300/api/v1/users/users/fetch-notverified-users"
      );
      setUnverifiedUsers(res.data?.users || []);
    } catch (err) {
      console.error("Failed to fetch unverified users", err);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📊 Admin Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📦 Users With Rentals</h2>
        {usersWithRentals.length > 0 ? (
          <ul className="space-y-2">
            {usersWithRentals.map((user) => (
              <li key={user._id} className="p-4 bg-gray-800 rounded-lg">
                <p><strong>Name:</strong> {user.fullname} {user.surname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rentals:</strong> {user.rentals?.length || 0}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rental data available.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🚫 Unverified Users</h2>
        {unverifiedUsers.length > 0 ? (
          <ul className="space-y-2">
            {unverifiedUsers.map((user) => (
              <li key={user._id} className="p-4 bg-gray-800 rounded-lg">
                <p><strong>Name:</strong> {user.fullname} {user.surname}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>All users are verified ✅</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
