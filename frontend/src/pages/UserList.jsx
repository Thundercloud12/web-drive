import React, { useEffect, useState } from "react";
import axios from "axios";
import { BadgeCheck, BookOpen } from "lucide-react";

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
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-[#c2a27a]">
        <h1 className="text-3xl font-serif font-bold text-[#4a3628] text-center mb-8">
          Verified Users & Issued Books
        </h1>

        {loading ? (
          <p className="text-center text-gray-700 text-lg font-medium">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-700 text-lg">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="border border-[#c2a27a] rounded-xl shadow-md p-5 bg-[#fdf8f3] hover:shadow-2xl hover:scale-[1.02] transition duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-[#4a3628]">
                    {user.username || `${user.fullname} ${user.surname}`}
                  </h2>
                  <span title="Verified User">
                    <BadgeCheck size={20} className="text-green-600" />
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-1">
                  <strong>Email:</strong> {user.email}
                </p>

                <div className="flex items-center gap-2 text-sm mt-2 text-[#4a3628]">
                  <BookOpen size={18} />
                  <span className={user.issuedCount === 0 ? "text-red-500 font-medium" : ""}>
                    {user.issuedCount} {user.issuedCount === 1 ? "Book" : "Books"} Issued
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
