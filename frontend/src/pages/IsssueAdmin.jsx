import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";

const IssueAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4300/api/v1/rentals/pending");
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
      await axios.patch(`http://localhost:4300/api/v1/rentals/update-status/${id}`, {
        status: newStatus,
      });
      fetchRequests(); // Refresh after update
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
    <div className="min-h-screen bg-[#f7efe5] p-6">
      <h1 className="text-2xl font-bold text-center mb-8 text-[#4a3628]">📚 Pending Book Requests</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <motion.div
              key={req._id}
              className="bg-white shadow-xl rounded-xl p-5 border border-[#c2a27a]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-[#4a3628] mb-2">
                📖 Book: <span className="font-bold">{req.book?.title || "Unknown"}</span>
              </h2>
              <p className="text-gray-700 mb-1">👤 User: {req.user?.fullname || "Unknown"}</p>
              <p className="text-gray-600 mb-3">
                Status: <span className="font-bold">{req.status}</span>
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  className="btn btn-sm btn-outline btn-info"
                  onClick={() => setSelectedUser(req.user)}
                >
                  View User
                </button>
                <button
                  className="btn btn-sm btn-outline btn-warning"
                  onClick={() => setSelectedBook(req.book)}
                >
                  View Book
                </button>
                <button
                  className="btn btn-sm btn-success"
                  disabled={req.status === "collected"}
                  onClick={() => updateStatus(req._id, getNextStatus(req.status))}
                >
                  {req.status === "pending"
                    ? "✅ Approve"
                    : req.status === "approved"
                    ? "📦 Mark as Collected"
                    : "✅ Done"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.dialog
            className="modal modal-open"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">👤 User Details</h3>
              <p><strong>Name:</strong> {selectedUser.fullname} {selectedUser.surname}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <img
                src={selectedUser.idCardImage}
                alt="ID Card"
                className="mt-4 rounded shadow w-full max-w-xs mx-auto"
              />
              <div className="modal-action">
                <button className="btn" onClick={() => setSelectedUser(null)}>Close</button>
              </div>
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>

      {/* Book Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.dialog
            className="modal modal-open"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">📖 Book Details</h3>
              <p><strong>Title:</strong> {selectedBook.title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Description:</strong> {selectedBook.description}</p>
              <img
                src={selectedBook.imageUrl}
                alt="Book Cover"
                className="mt-4 rounded shadow w-full max-w-xs mx-auto"
              />
              <div className="modal-action">
                <button className="btn" onClick={() => setSelectedBook(null)}>Close</button>
              </div>
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssueAdmin;
