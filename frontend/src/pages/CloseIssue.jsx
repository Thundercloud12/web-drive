import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const CloseIssue = () => {
  const [issues, setIssues] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { darkMode } = useTheme(); 

  const fetchCollectedIssues = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4300/api/v1/users/rentals/collected");
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredIssues = issues.filter(
    (issue) =>
      issue.user?.fullname.toLowerCase().includes(searchTerm) ||
      issue.book?.title.toLowerCase().includes(searchTerm)
  );

  return (
    <div
      className={`min-h-screen p-6 font-['Oxygen'] ${
        darkMode
          ? "text-white bg-gradient-to-tr from-[#0d1117] to-[#161b22]"
          : "text-[#0d1117] bg-gradient-to-tr from-white to-gray-100"
      }`}
    >
      <h1
        className={`text-3xl font-bold text-center mb-6 ${
          darkMode ? "text-[#58a6ff]" : "text-blue-600"
        }`}
      >
        📦 Close Book Issues
      </h1>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="🔍 Search by user or book..."
        className={`w-full md:w-1/2 mx-auto block mb-8 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
          darkMode
            ? "bg-[#161b22] border-[#30363d] text-white focus:ring-[#58a6ff]"
            : "bg-white border-gray-300 text-black focus:ring-blue-400"
        }`}
      />

      {loading ? (
        <p className="text-center text-gray-400">Loading issues...</p>
      ) : filteredIssues.length === 0 ? (
        <p className="text-center text-gray-400">No ongoing issues found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredIssues.map((issue) => {
              const { days } = getTimeDiff(issue.collectedDate);
              const isOverdue = days > 7;

              return (
                <motion.div
                  key={issue._id}
                  className={`rounded-lg p-5 shadow-md border ${
                    darkMode
                      ? "bg-[#21262d] border-[#30363d]"
                      : "bg-white border-gray-300"
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                >
                  <h2
                    className={`text-xl font-semibold mb-2 ${
                      darkMode ? "text-[#58a6ff]" : "text-blue-600"
                    }`}
                  >
                    📖 {issue.book?.title || "Unknown"}
                  </h2>
                  <p className="mb-1">
                    👤 {issue.user?.fullname || "Unknown"}
                  </p>
                  <p className="mb-1">
                    Collected On:{" "}
                    <span className="font-medium">
                      {new Date(issue.collectedDate).toLocaleDateString()}
                    </span>
                  </p>

                  {isOverdue && (
                    <p className="text-red-500 font-semibold mb-2">
                      ⚠️ Overdue by {days - 7} days
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap mt-2">
                    <button
                      className="btn btn-sm bg-[#238636] hover:bg-[#2ea043] text-white"
                      onClick={() => setSelectedUser(issue.user)}
                    >
                      View User
                    </button>
                    <button
                      className="btn btn-sm bg-[#8957e5] hover:bg-[#a371f7] text-white"
                      onClick={() => setSelectedBook(issue.book)}
                    >
                      View Book
                    </button>
                    <button
                      className="btn btn-sm bg-[#da3633] hover:bg-[#f85149] text-white"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      Close Issue
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.dialog className="modal modal-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`modal-box ${darkMode ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-300"} border text-white`}>
              <h3 className="font-bold text-lg text-[#58a6ff]">👤 User Details</h3>
              <p><strong>Name:</strong> {selectedUser.fullname} {selectedUser.surname}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <img
                src={selectedUser.idCardImage}
                alt="ID Card"
                className="mt-4 rounded shadow w-full max-w-xs mx-auto"
              />
              <div className="modal-action">
                <button className="btn bg-[#30363d] text-white" onClick={() => setSelectedUser(null)}>Close</button>
              </div>
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>

      {/* Book Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.dialog className="modal modal-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`modal-box ${darkMode ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-300"} border text-white`}>
              <h3 className="font-bold text-lg text-[#58a6ff]">📖 Book Details</h3>
              <p><strong>Title:</strong> {selectedBook.title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Description:</strong> {selectedBook.description}</p>
              <img
                src={selectedBook.imageUrl}
                alt="Book Cover"
                className="mt-4 rounded shadow w-full max-w-xs mx-auto"
              />
              <div className="modal-action">
                <button className="btn bg-[#30363d] text-white" onClick={() => setSelectedBook(null)}>Close</button>
              </div>
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>

      {/* Close Issue Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.dialog className="modal modal-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={`modal-box ${darkMode ? "bg-[#161b22] border-[#30363d]" : "bg-white border-gray-300"} border text-white`}>
              <h3 className="font-bold text-lg text-[#58a6ff]">🕒 Issue Duration</h3>
              <p>
                This issue has been active for{" "}
                <span className="font-bold text-[#cd3119e9]">
                  {getTimeDiff(selectedIssue.collectedDate).days} days and{" "}
                  {getTimeDiff(selectedIssue.collectedDate).hours} hours
                </span>.
              </p>
              <div className="modal-action">
                <button className="btn bg-[#238636] text-white hover:bg-[#2ea043]" onClick={closeIssue}>
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
