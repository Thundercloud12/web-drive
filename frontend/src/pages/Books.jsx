import React, { useEffect, useState } from "react";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/books");
      setBooks(res.data.books || []);
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#0d1117] text-white">
      <h1 className="text-3xl font-bold text-center mb-8">📚 Available Books</h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-400">No books available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-[#161b22] border border-gray-700 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={book.image}
                alt={book.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-400">{book.author}</p>
                <p className="mt-2 text-sm">{book.description}</p>
                <p className="mt-2 font-semibold">
                  Quantity: {book.quantity > 0 ? book.quantity : "Out of Stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
