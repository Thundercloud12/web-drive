import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { XCircle } from "lucide-react";

const IssueAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const { darkMode } = useTheme();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4300/api/v1/users/rentals/pending");
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:4300/api/v1/users/rentals/update-status/${id}`, {
        status: newStatus,
      });
      fetchRequests();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const getNextStatus = (current) => {
    if (current === "pending") return "approved";
    if (current === "approved") return "collected";
    return "done";
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-[#0d1117] text-white" : "bg-white text-black"}`} style={{ fontFamily: "'Oxygen', sans-serif" }}>
      <h2 className="text-4xl font-bold text-center mb-8">📦 Pending Book Requests</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-400">No pending requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className={`rounded-xl shadow-lg p-6 border transition-all ${darkMode ? "bg-[#161b22] border-gray-700" : "bg-white border-gray-300"}`}
            >
              <h3 className="text-xl font-semibold mb-2">📖 {req.book?.title || "Unknown Book"}</h3>
              <p className="mb-1">👤 <strong>{req.user?.fullname || "Unknown User"}</strong></p>
              <p className="mb-3 text-sm">Status: <span className="font-semibold">{req.status}</span></p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedUser(req.user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-md transition"
                >
                  View User
                </button>
                <button
                  onClick={() => setSelectedBook(req.book)}
                  className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-1 rounded-md transition"
                >
                  View Book
                </button>
                <button
                  onClick={() => updateStatus(req._id, getNextStatus(req.status))}
                  disabled={req.status === "collected"}
                  className={`text-white text-sm font-medium px-4 py-1 rounded-md transition ${
                    req.status === "pending"
                      ? "bg-green-600 hover:bg-green-700"
                      : req.status === "approved"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {req.status === "pending"
                    ? "✅ Approve"
                    : req.status === "approved"
                    ? "📦 Mark as Collected"
                    : "✅ Done"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-md relative ${darkMode ? "bg-[#161b22] text-white border border-gray-700" : "bg-white text-black border border-gray-300"}`}>
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-4">👤 User Details</h3>
              <p><strong>Name:</strong> {selectedUser.fullname} {selectedUser.surname}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <img
                src={selectedUser.idCardImage}
                alt="ID Card"
                className="mt-4 rounded shadow w-full max-w-xs mx-auto border"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-md relative ${darkMode ? "bg-[#161b22] text-white border border-gray-700" : "bg-white text-black border border-gray-300"}`}>
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-4">📖 Book Details</h3>
              <p><strong>Title:</strong> {selectedBook.title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Description:</strong> {selectedBook.description}</p>
              <img
                src={selectedBook.imageUrl}
                alt="Book Cover"
                className="mt-4 rounded shadow w-full max-w-xs mx-auto border"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssueAdmin;
