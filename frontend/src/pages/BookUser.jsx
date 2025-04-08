import React, { useEffect, useState } from 'react';
import axios from '../utils/axios'; // Using custom axios instance

const BooksUser = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/users/books");
      console.log(res);
      
      setBooks(res.data || []);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleIssue = async (bookId) => {
    setLoading(true);
    try {
     const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

    await axios.post(
      "http://localhost:4300/api/v1/users/rentals/issue",
      { ISBN: selectedBook.ISBN}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
      alert("✅ Request sent! Status set to pending.");
      setSelectedBook(null);
    } catch (err) {
      console.error("Issue request failed", err);
      alert("❌ Something went wrong while issuing the book.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 bg-[#0d1117] text-white min-h-screen">
      <h2 className="text-3xl text-center font-bold mb-6 text-white">📚 Explore Available Books</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="bg-[#161b22] border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <img
              src={`http://localhost:4300/${book.image}`} // ✅ Fix here
              alt={book.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-400">{book.author}</p>
              <p className="mt-2 text-sm text-gray-300 line-clamp-2">{book.description}</p>
              <p className="mt-1 text-sm">Quantity: {book.quantity}</p>
              <p className="text-sm text-gray-400">ISBN: {book.ISBN}</p>
              <button
                onClick={() => setSelectedBook(book)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
              >
                View & Issue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-[#161b22] border border-gray-600 rounded-lg p-6 w-[90%] md:w-1/2 max-w-xl">
            <h3 className="text-xl font-bold mb-2">{selectedBook.title}</h3>
            <img
              src={`http://localhost:4300/${selectedBook.image}`}
              alt={selectedBook.title}
              className="w-full h-60 object-cover rounded"
            />
            <p className="mt-4 text-gray-300">{selectedBook.description}</p>
            <p className="mt-2 text-sm text-gray-400">Author: {selectedBook.author}</p>
            <p className="text-sm text-gray-400">ISBN: {selectedBook.ISBN}</p>
            <p className="text-sm text-gray-400">Quantity: {selectedBook.quantity}</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setSelectedBook(null)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Close
              </button>
              <button
                onClick={() => handleIssue(selectedBook.ISBN)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                disabled={loading}
              >
                {loading ? "Sending..." : "Issue Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksUser;
