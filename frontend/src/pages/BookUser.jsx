import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BooksUser = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleIssue = async (bookId) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:4300/api/v1/rentals/issue", { bookId });
      alert("Request sent! Status set to pending.");
      setSelectedBook(null);
    } catch (err) {
      console.error("Issue request failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-[#f6eee4] to-[#d6bfa5] min-h-screen">
      <h2 className="text-3xl text-center text-[#4a3628] font-bold mb-6">Explore Available Books</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="card shadow-xl bg-white border border-[#c2a27a]">
            <figure><img src={book.image} alt={book.title} className="h-48 object-cover w-full" /></figure>
            <div className="card-body">
              <h2 className="card-title text-[#4a3628]">{book.title}</h2>
              <p className="text-sm text-gray-600 truncate">{book.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm bg-[#6b4f37] text-white hover:bg-[#4a3628]" onClick={() => setSelectedBook(book)}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBook && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-white border border-[#c2a27a]">
            <h3 className="font-bold text-xl text-[#4a3628]">{selectedBook.title}</h3>
            <img src={selectedBook.image} alt={selectedBook.title} className="w-full h-60 object-cover my-4 rounded" />
            <p className="text-sm text-gray-700">{selectedBook.description}</p>
            <div className="modal-action flex justify-between items-center">
              <button className="btn bg-gray-300" onClick={() => setSelectedBook(null)}>Close</button>
              <button className="btn bg-[#6b4f37] text-white hover:bg-[#4a3628]" onClick={() => handleIssue(selectedBook._id)} disabled={loading}>
                {loading ? "Sending..." : "Issue Book"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default BooksUser;
