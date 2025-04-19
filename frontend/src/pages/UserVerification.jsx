import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext"; // ✅ Assuming this is your theme provider path

const UserVerification = () => {
  const { darkMode } = useTheme(); // ✅ Access theme state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4300/api/v1/users/fetch-notverified-users"
        );
        console.log(response.data.users)
        setUsers(response.data.users || []);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleVerify = async (feesReceiptNo, email) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:4300/api/v1/users/verify-signed-up-user", {
        feesReceiptNo,
        email,
      });
      setUsers((prev) => prev.filter((user) => user.feesReceiptNo !== feesReceiptNo));
      setSelectedUser(null);
      toast.success("User verified successfully!");
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Verification failed. Please try again.");
    }
    setLoading(false);
  };

  const getInitials = (fullname = "", surname = "") => {
    return `${fullname.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
    <motion.div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-[#0d1117] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        User Verification
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table
          className={`min-w-full rounded-xl overflow-hidden ${
            darkMode ? "bg-[#161b22]" : "bg-white"
          }`}
        >
          <thead
            className={`font-semibold text-xs sm:text-sm ${
              darkMode ? "bg-[#21262d] text-gray-300" : "bg-gray-200 text-gray-700"
            }`}
          >
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={`transition duration-200 text-xs sm:text-sm border-b ${
                  darkMode
                    ? "hover:bg-[#1f2937] border-[#30363d]"
                    : "hover:bg-gray-100 border-gray-300"
                }`}
              >
                <td className="py-3 px-4">{user._id.slice(-6)}</td>
                <td className="py-3 px-4">{user.fullname} {user.surname}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-[#238636] text-white px-3 py-1 rounded hover:bg-[#2ea043] transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-5 text-gray-400">
                  No users pending verification
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl p-6 w-[95%] max-w-md shadow-xl relative border ${
                darkMode
                  ? "bg-[#161b22] text-white border-[#30363d]"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">
                {selectedUser.fullname} {selectedUser.surname}
              </h3>
              <p className="mb-1">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="mb-4">
                <strong>Receipt No:</strong> {selectedUser.feesReceiptNo}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-1 font-semibold">Profile Image:</p>
                  {selectedUser.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt="Profile"
                      className="w-full rounded-md border hover:scale-105 transition-transform duration-200"
                      onError={(e) => (e.target.src = "/fallback-user.png")}
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center text-4xl font-bold bg-gray-700 rounded-md">
                      {getInitials(selectedUser.fullname, selectedUser.surname)}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm mb-1 font-semibold">ID Card Image:</p>
                  {selectedUser.idCardImage ? (
                    <div className="max-h-52 overflow-auto border rounded-md">
                      <img
                        src={selectedUser.idCardImage}
                        alt="ID Card"
                        className="w-full object-contain hover:scale-105 transition-transform duration-200"
                        onError={(e) => (e.target.src = "/fallback-id.png")}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-500 border p-4 rounded-md">
                      No ID card image uploaded.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() =>
                    handleVerify(selectedUser.feesReceiptNo, selectedUser.email)
                  }
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-white ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? (
                    <span className="animate-pulse">Verifying...</span>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Verify
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md"
                >
                  <XCircle size={18} />
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserVerification;
