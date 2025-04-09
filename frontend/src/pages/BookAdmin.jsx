import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { XCircle } from "lucide-react";

const BooksAdmin = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    quantity: "",
    ISBN: "",
    imageUrl: null,
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/users/books");
      console.log(res);
      
      setBooks(res.data || []);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, imageUrl: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("description", form.description);
    formData.append("quantity", form.quantity);
    formData.append("ISBN", form.ISBN);
    formData.append("imageUrl", form.imageUrl);
    formData.append("folderName", "books");

    try {
      await axios.post("/users/books/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchBooks();
      setForm({
        title: "",
        author: "",
        description: "",
        quantity: "",
        ISBN: "",
        imageUrl: null,
      });
      setShowFormModal(false);
    } catch (error) {
      console.error("Error adding book:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 bg-[#0d1117] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">📚 Admin Book Panel</h2>
        <button
          onClick={() => setShowFormModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          ➕ Add New Book
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-700 rounded-lg">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-[#161b22] border-b border-gray-700">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">ISBN</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book._id}
                className="border-b border-gray-700 hover:bg-[#1e2329]"
              >
                <td className="px-4 py-3">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">{book.quantity}</td>
                <td className="px-4 py-3">{book.ISBN}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="text-blue-500 hover:underline"
                  >
                    More Info
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No books available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Book Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-[#161b22] p-6 rounded-xl w-full max-w-md border border-gray-700 relative">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <XCircle size={22} />
            </button>
            <h3 className="text-xl font-semibold mb-4">➕ Add New Book</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 rounded bg-[#0d1117] border border-gray-700"
                required
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 rounded bg-[#0d1117] border border-gray-700"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 rounded bg-[#0d1117] border border-gray-700"
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 rounded bg-[#0d1117] border border-gray-700"
                required
              />
              <input
                type="text"
                name="ISBN"
                placeholder="ISBN"
                value={form.ISBN}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 rounded bg-[#0d1117] border border-gray-700"
                required
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 mb-4 rounded bg-[#0d1117] border border-gray-700"
                accept="image/*"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-[#161b22] text-white p-6 rounded-xl w-full max-w-lg border border-gray-700 relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <XCircle size={22} />
            </button>
            <h3 className="text-2xl font-bold mb-2">{selectedBook.title}</h3>
            <p className="text-sm mb-1 text-gray-400">
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p className="text-sm mb-1 text-gray-400">
              <strong>ISBN:</strong> {selectedBook.ISBN}
            </p>
            <p className="text-sm mb-3 text-gray-300">
              <strong>Description:</strong> {selectedBook.description}
            </p>
            <img
              src={selectedBook.imageUrl}
              alt={selectedBook.title}
              className="max-h-64 w-full object-contain rounded border border-gray-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksAdmin;
