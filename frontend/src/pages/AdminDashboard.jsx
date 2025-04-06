import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const AdminDashboard = () => {
  const [usersWithRentals, setUsersWithRentals] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [closureRequests, setClosureRequests] = useState([]);

  useEffect(() => {
    fetchUsersWithRentals();
    fetchUnverifiedUsers();
    fetchBooks();
    fetchPendingRequests();
    fetchClosureRequests();
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
      const res = await axios.post("/users/users/fetch-notverified-users");
      setUnverifiedUsers(res.data?.users || []);
    } catch (err) {
      console.error("❌ Failed to fetch unverified users", err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books/all-books");
      setBooks(res.data?.books || []);
    } catch (err) {
      console.error("❌ Failed to fetch books", err);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get("/rentals/pending");
      setPendingRequests(res.data?.requests || []);
    } catch (err) {
      console.error("❌ Failed to fetch pending requests", err);
    }
  };

  const fetchClosureRequests = async () => {
    try {
      const res = await axios.get("/rentals/closure-requests");
      setClosureRequests(res.data?.requests || []);
    } catch (err) {
      console.error("❌ Failed to fetch closure requests", err);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

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
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending rental requests.</p>
        )}
      </section>

      {/* Rental Closure Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-2">✅ Rental Closure Requests</h2>
        {closureRequests.length > 0 ? (
          <ul className="space-y-2">
            {closureRequests.map((req) => (
              <li key={req._id} className="p-4 bg-gray-800 rounded-lg">
                <p><strong>User:</strong> {req.user?.fullname}</p>
                <p><strong>Book:</strong> {req.book?.title}</p>
                <p><strong>Request Date:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No closure requests.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
