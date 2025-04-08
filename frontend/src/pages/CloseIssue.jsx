import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";

const CloseIssue = () => {
  const [issues, setIssues] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCollectedIssues = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4300/api/v1/users/rentals/collected"); // You should create this route in backend
      setIssues(data);
    } catch (error) {
      console.error("Error fetching collected issues:", error);
    } finally {
      setLoading(false);
    }
  };

const closeIssue = async () => {
  try {
    if (!selectedIssue) return;

    await axios.put(`http://localhost:4300/api/v1/users/rentals/close/${selectedIssue._id}`);
    setSelectedIssue(null);
    fetchCollectedIssues(); 
  } catch (error) {
    console.error("Error in closing issue:", error);
  }
};


  useEffect(() => {
    fetchCollectedIssues();
  }, []);

  const getTimeDiff = (collectedDate) => {
    const collected = new Date(collectedDate);
    const now = new Date();
    const diffMs = now - collected;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    return { days: diffDays, hours: diffHours };
  };

  return (
    <div className="min-h-screen bg-[#f7efe5] p-6">
      <h1 className="text-2xl font-bold text-center mb-8 text-[#4a3628]">📦 Ongoing Issues</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading issues...</p>
      ) : issues.length === 0 ? (
        <p className="text-center text-gray-500">No ongoing issues.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {issues.map((issue) => (
            <motion.div
              key={issue._id}
              className="bg-white shadow-xl rounded-xl p-5 border border-[#c2a27a]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-[#4a3628] mb-2">
                📖 Book: <span className="font-bold">{issue.book?.title || "Unknown"}</span>
              </h2>
              <p className="text-gray-700 mb-1">👤 User: {issue.user?.fullname || "Unknown"}</p>
              <p className="text-gray-600 mb-3">
                Collected On:{" "}
                <span className="font-medium">
                  {new Date(issue.collectedDate).toLocaleDateString()}
                </span>
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  className="btn btn-sm btn-outline btn-info"
                  onClick={() => setSelectedUser(issue.user)}
                >
                  View User
                </button>
                <button
                  className="btn btn-sm btn-outline btn-warning"
                  onClick={() => setSelectedBook(issue.book)}
                >
                  View Book
                </button>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => setSelectedIssue(issue)}
                >
                  Close Issue
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.dialog className="modal modal-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="modal-box">
              <h3 className="font-bold text-lg">👤 User Details</h3>
              <p><strong>Name:</strong> {selectedUser.fullname} {selectedUser.surname}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <img
                src={`http://localhost:4300/${selectedUser.idCardImage.replace(/\\/g, "/")}`}
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
          <motion.dialog className="modal modal-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="modal-box">
              <h3 className="font-bold text-lg">📖 Book Details</h3>
              <p><strong>Title:</strong> {selectedBook.title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Description:</strong> {selectedBook.description}</p>
              <img
                src={`http://localhost:4300${selectedBook.imageUrl}`}
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

      {/* Close Issue Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.dialog className="modal modal-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="modal-box">
              <h3 className="font-bold text-lg">🕒 Issue Duration</h3>
              <p>
                This issue has been active for{" "}
                <span className="font-bold text-[#4a3628]">
                  {getTimeDiff(selectedIssue.collectedDate).days} days and{" "}
                  {getTimeDiff(selectedIssue.collectedDate).hours} hours
                </span>
                .
              </p>
              <div className="modal-action">
              <button className="btn btn-success" onClick={closeIssue}>
                Confirm Close Issue
              </button>
              </div>
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CloseIssue;
