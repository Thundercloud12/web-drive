import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [usersWithRentals, setUsersWithRentals] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalRentals: 0,
  });
  const [categoryData, setCategoryData] = useState([]);

  const { darkMode } = useTheme();

  useEffect(() => {
    fetchUsersWithRentals();
    fetchUnverifiedUsers();
    // fetchBooks();
    fetchPendingRequests();
    fetchStats();
  }, []);

  const fetchUsersWithRentals = async () => {
    try {
      const res = await axios.get("/users/admin/with-rentals");
      setUsersWithRentals(res.data?.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch rentals", err);
    }
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/users/fetch-notverified-users");
      console.log(res.data)
      setUnverifiedUsers(res.data?.users || []);
    } catch (err) {
      console.error("❌ Failed to fetch unverified users", err);
    }
  };

  // const fetchBooks = async () => {
  //   try {
  //     const res = await axios.get("/users/books");
  //     setBooks(res.data?.books || []);

  //     const categoryMap = {};
  //     res.data?.books.forEach((book) => {
  //       categoryMap[book.category] = (categoryMap[book.category] || 0) + 1;
  //     });
  //     const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  //     setCategoryData(chartData);
  //   } catch (err) {
  //     console.error("❌ Failed to fetch books", err);
  //   }
  // };

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get("/rentals/pending");
      setPendingRequests(res.data?.requests || []);
    } catch (err) {
      console.error("❌ Failed to fetch pending requests", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/stats");
      console.log(res.data)
      setStats(res.data || {});
    } catch (err) {
      console.error("❌ Failed to fetch stats", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/rentals/approve/${id}`);
      fetchPendingRequests();
    } catch (err) {
      console.error("Failed to approve rental", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`/rentals/reject/${id}`);
      fetchPendingRequests();
    } catch (err) {
      console.error("Failed to reject rental", err);
    }
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];

  return (
    
    <div className={darkMode ? "bg-[#1f1f1f] text-white" : "bg-white text-black"}>
      <div className="flex">
        <main
          className="flex-1 p-6 min-h-screen"
          style={{ fontFamily: "'Oxygen', sans-serif" }}
        >
          <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  {[{ label: "👥 Users", value: stats.users },
    { label: "📚 Books", value: stats.books },
    { label: "📦 Rentals", value: stats.rentals},
    { label: "🚫 Unverified", value: unverifiedUsers.length }].map((stat, index) => (
    <div
      key={index}
      className={`${
        darkMode ? "bg-[#161b22] border-[#30363d]" : "bg-[#f0f6fc] border-gray-300"
      } p-6 rounded-xl shadow-md border`}
    >
      <h2 className="text-xl font-semibold">{stat.label}</h2>
      <p className="text-lg">{stat.value}</p>
    </div>
  ))}
</section>


          {/* Charts Section
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">📊 Book Category Distribution</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <PieChart width={400} height={300}>
                <Pie
                  dataKey="value"
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>

              <LineChart
                width={500}
                height={300}
                data={categoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
          </section> */}

          {/* Users With Rentals */}
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

          {/* Unverified Users */}
          <section className="mb-10">
  <h2 className="text-xl font-semibold mb-2">🚫 Unverified Users</h2>
  {unverifiedUsers.length > 0 ? (
    <ul className="space-y-2">
      {unverifiedUsers.map((user) => (
        <li
          key={user._id}
          className={`${
            darkMode ? "bg-[#161b22] border-[#30363d]" : "bg-[#f0f6fc] border-gray-300"
          } p-4 rounded-lg`}
        >
          <p><strong>Name:</strong> {user.fullname} {user.surname}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p>All users are verified ✅</p>
  )}
</section>


          {/* Book List */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-2">📚 Book List</h2>
            {books.length > 0 ? (
              <ul className="space-y-2">
                {books.map((book) => (
                  <li key={book._id} className="p-4 bg-gray-800 rounded-lg">
                    <p><strong>Title:</strong> {book.title}</p>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Category:</strong> {book.category}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No books available.</p>
            )}
          </section>

          {/* Pending Rental Requests */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-2">🕓 Pending Rental Requests</h2>
            {pendingRequests.length > 0 ? (
              <ul className="space-y-2">
                {pendingRequests.map((req) => (
                  <li key={req._id} className="p-4 bg-gray-800 rounded-lg">
                    <p><strong>User:</strong> {req.user?.fullname}</p>
                    <p><strong>Book:</strong> {req.book?.title}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="px-4 py-1 bg-green-600 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="px-4 py-1 bg-red-600 rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending rental requests.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
