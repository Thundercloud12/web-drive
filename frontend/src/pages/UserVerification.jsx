import React, { useEffect, useState } from "react";
import axios from "axios";

const UserVerification = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4300/api/v1/users/fetch-notverified-users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Function to handle user verification
  const handleVerify = async (feesReceiptNo, email) => {
    setLoading(true);
    try {
      const repsonse = await axios.post("http://localhost:4300/api/v1/users/verify-signed-up-user", {feesReceiptNo, email});
      setUsers(users.filter(user => user.feesReceiptNo !== feesReceiptNo)); 
      setSelectedUser(null); 
    } catch (error) {
      console.error("Error verifying user:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Verification</h2>

      {/* User List */}
      <div className="overflow-x-auto">
        <table className="table w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td>{user._id}</td>
                <td>{user.fullname} {user.surname}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2">{selectedUser.fullname} {selectedUser.surname}</h3>
            <p>Email: {selectedUser.email}</p>
            <p>Receipt No: {selectedUser.feesReceiptNo}</p>

            {/* User Images */}
            <div className="mt-4">
              <h4 className="font-semibold">Uploaded Images:</h4>
              <img src={selectedUser.profileImage} alt="Profile" className="w-full rounded-lg mb-2" />
              <img src={selectedUser.idCardImage} alt="ID Card" className="w-full rounded-lg" />
            </div>

            {/* Verification Buttons */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleVerify(selectedUser.feesReceiptNo, selectedUser.email)}
                className={`btn btn-success ${loading ? "btn-disabled" : ""}`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="btn btn-outline btn-error"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerification;
