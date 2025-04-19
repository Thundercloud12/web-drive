import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { XCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

const BooksAdmin = () => {
  const { darkMode } = useTheme();
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
  const [loading, setLoading] = useState(false)
  const deleteBook = async (ISBN) => {
    setLoading(true);
    try {
      const res = await axios.delete("http://localhost:4300/api/v1/users/delete-book", {
        data: { ISBN },
        withCredentials: true
      });
      if(res.status == 201) {
        toast.success("Book deleted successfully");
        fetchBooks(); // ⬅️ Refresh book list
        setLoading(false);
        setShowFormModal(false);
        setSelectedBook(null); // Clear modal
        return;
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching books", error);
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/users/books");
      console.log(res.data)
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
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
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
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-[#0d1117] text-white" : "bg-white text-black"
      }`}
      style={{ fontFamily: "'Oxygen', sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">
          📚 Admin Book Panel
        </h2>
        <button
          onClick={() => setShowFormModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-5 py-2 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-xl"
        >
          ➕ Add New Book
        </button>
      </div>

      <div
        className={`overflow-x-auto border rounded-xl shadow-lg ${
          darkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <table className="min-w-full table-auto text-left">
          <thead className={`${darkMode ? "bg-[#161b22]" : "bg-gray-200"} text-sm`}>
            <tr className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">ISBN</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr
                  key={book._id}
                  className={`transition-all ${
                    darkMode
                      ? "border-b border-gray-800 hover:bg-[#1e2329]"
                      : "border-b border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <td className="px-6 py-3">{book.title}</td>
                  <td className="px-6 py-3">{book.author}</td>
                  <td className="px-6 py-3">{book.quantity}</td>
                  <td className="px-6 py-3">{book.ISBN}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      More Info
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
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
          <div
            className={`p-6 rounded-2xl shadow-2xl w-full max-w-lg relative animate-fadeIn ${
              darkMode
                ? "bg-[#161b22] text-white border border-gray-700"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4">➕ Add New Book</h3>
            <form onSubmit={handleSubmit}>
              {[
                { name: "title", type: "text", placeholder: "Book Title" },
                { name: "author", type: "text", placeholder: "Author" },
                { name: "description", type: "textarea", placeholder: "Description" },
                { name: "quantity", type: "number", placeholder: "Quantity" },
                { name: "ISBN", type: "text", placeholder: "ISBN" },
              ].map((input) =>
                input.type === "textarea" ? (
                  <textarea
                    key={input.name}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={form[input.name]}
                    onChange={handleInputChange}
                    className={`w-full p-3 mb-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? "bg-[#0d1117] border border-gray-700 text-white focus:ring-blue-600"
                        : "bg-gray-100 border border-gray-300 text-black focus:ring-blue-500"
                    }`}
                    required
                  />
                ) : (
                  <input
                    key={input.name}
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={form[input.name]}
                    onChange={handleInputChange}
                    className={`w-full p-3 mb-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? "bg-[#0d1117] border border-gray-700 text-white focus:ring-blue-600"
                        : "bg-gray-100 border border-gray-300 text-black focus:ring-blue-500"
                    }`}
                    required
                  />
                )
              )}

              <input
                type="file"
                onChange={handleImageChange}
                className="w-full text-gray-400 file:bg-[#0d1117] file:border-none file:text-white file:rounded file:py-2 file:px-4 file:cursor-pointer mb-4"
                accept="image/*"
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className={`p-6 rounded-2xl shadow-2xl w-full max-w-lg border relative animate-fadeIn ${
              darkMode
                ? "bg-[#161b22] text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-3xl font-bold mb-3">{selectedBook.title}</h3>
            <p className="text-sm mb-2">
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p className="text-sm mb-2">
              <strong>ISBN:</strong> {selectedBook.ISBN}
            </p>
            <p className="text-sm mb-4">
              <strong>Description:</strong> {selectedBook.description}
            </p>
            <img
              src={selectedBook.imageUrl || "/fallback-book.png"}
              alt={selectedBook.title}
              className="w-full max-h-72 object-contain rounded-lg border"
            />
                    <button
              onClick={() => {deleteBook(selectedBook.ISBN)}}
              disabled={loading}
              className={`btn btn-error transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Loading..." : "Delete Book"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksAdmin;
