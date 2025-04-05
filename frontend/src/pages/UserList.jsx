import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersWithRentals = async () => {
      try {
        const response = await axios.get("http://localhost:4300/api/v1/users/with-rentals");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users with rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithRentals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e7dac7] to-[#c2a27a] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-serif font-bold text-[#4a3628] text-center mb-6">
          Verified Users & Issued Books
        </h1>

        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="border border-[#c2a27a] rounded-2xl shadow-md p-4 bg-[#fdf8f3] hover:shadow-lg transition duration-300"
              >
                <h2 className="text-xl font-semibold text-[#4a3628] mb-2">
                  {user.username || `${user.fullname} ${user.surname}`}
                </h2>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Issued Books:</strong> {user.issuedCount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
