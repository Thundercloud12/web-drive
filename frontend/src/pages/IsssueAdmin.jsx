import React, { useEffect, useState } from "react";
import axios from "axios";

const IsssueAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("http://localhost:4300/api/v1/rentals/pending");
      setRequests(data); // should return populated rental docs
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:4300/api/v1/rentals/update-status/${id}`, { status: newStatus });
      fetchRequests(); // Refresh data
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7efe5] p-6">
      <h1 className="text-2xl font-semibold text-center mb-6 text-[#4a3628]">📚 Pending Book Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div key={req._id} className="bg-white shadow-md rounded-xl p-4 border border-[#c2a27a]">
            <h2 className="text-lg font-medium text-[#4a3628] mb-2">Book ID: {req.book?._id}</h2>
            <p className="text-gray-600 mb-2">Status: <span className="font-bold">{req.status}</span></p>
            
            <div className="flex gap-2">
              <button className="btn btn-outline btn-info" onClick={() => setSelectedUser(req.user)}>
                View User
              </button>
              <button className="btn btn-outline btn-warning" onClick={() => setSelectedBook(req.book)}>
                View Book
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  const nextStatus = req.status === "pending" ? "approved" : "collected";
                  updateStatus(req._id, nextStatus);
                }}
              >
                {req.status === "pending" ? "Approve" : req.status === "approved" ? "Mark as Collected" : "Done"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* USER MODAL */}
      {selectedUser && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">👤 User Details</h3>
            <p><strong>Full Name:</strong> {selectedUser.fullname} {selectedUser.surname}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <img src={selectedUser.idCardImage} alt="ID Card" className="mt-4 rounded shadow" />
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}

      {/* BOOK MODAL */}
      {selectedBook && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">📖 Book Details</h3>
            <p><strong>Title:</strong> {selectedBook.title}</p>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            <img src={selectedBook.imageUrl} alt="Book Cover" className="mt-4 rounded shadow" />
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedBook(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default IsssueAdmin;
