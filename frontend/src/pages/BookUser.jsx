import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const BooksUser = () => {
  const { darkMode } = useTheme();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/users/books");
      console.log(res);
      
      setBooks(res.data || []);
      setFilteredBooks(res.data || []);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleIssue = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      
      await axios.post(
        "http://localhost:4300/api/v1/users/rentals/issue",
        { ISBN: selectedBook.ISBN },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      alert("✅ Request sent! Status set to pending.");
      setSelectedBook(null);
    } catch (err) {
      console.log(err);
      
      console.error("Issue request failed", err);
      alert("❌ Something went wrong while issuing the book.");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = books.filter(
      book =>
        book.title.toLowerCase().includes(value) ||
        book.author.toLowerCase().includes(value)
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div
      className={`p-6 min-h-screen font-['Oxygen'] transition-colors duration-300 ${
        darkMode ? 'bg-[#0d1117] text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <h2 className="text-3xl text-center font-bold mb-6">
        📚 Explore Available Books
      </h2>


      <div className="relative max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="🔍 Search by title or author..."
          value={searchTerm}
          onChange={handleSearch}
          className={`w-full px-5 py-3 rounded-full backdrop-blur border focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner
            ${darkMode
              ? 'bg-[#161b22]/70 border-gray-600 focus:border-pink-500 text-white placeholder:text-gray-400'
              : 'bg-white border-gray-300 focus:border-pink-500 text-black placeholder:text-gray-500'}
          `}
        />
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1011 18a7.5 7.5 0 005.65-1.35z" />
          </svg>
        </div>
      </div>

      {/* Book Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentBooks.map(book => (
          <div
            key={book._id}
            className={`border rounded-lg overflow-hidden shadow-lg transition-colors duration-300 ${
              darkMode
                ? 'bg-[#161b22] border-gray-700'
                : 'bg-white border-gray-300'
            }`}
          >
            <img
              src={book.imageUrl}
              alt={book.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-purple-500">{book.title}</h2>
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

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded border transition-colors ${
              currentPage === index + 1
                ? 'bg-purple-600 text-white'
                : darkMode
                ? 'bg-[#161b22] text-gray-400 border-gray-600'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-lg p-6 w-[90%] md:w-1/2 max-w-xl transition-colors duration-300 ${
                darkMode ? 'bg-[#161b22] border border-gray-600' : 'bg-white border border-gray-300'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-2 text-purple-500">{selectedBook.title}</h3>
              <img
                src={selectedBook.imageUrl}
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
                  onClick={handleIssue}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Issue Book"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooksUser;
