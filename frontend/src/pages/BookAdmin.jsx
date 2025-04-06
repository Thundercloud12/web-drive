import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const BooksAdmin = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    quantity: "",
    ISBN: "",
    image: null,
  });

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books");
      setBooks(res.data.books || []);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("description", form.description);
    formData.append("quantity", form.quantity);
    formData.append("ISBN", form.ISBN);
    formData.append("image", form.image);

    try {
      const response = await axios.post("/books/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Book added:", response.data);
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 bg-[#0d1117] text-white min-h-screen">
      <h2 className="text-3xl text-center font-bold mb-6">📚 Admin Book Panel</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#161b22] p-6 rounded-xl border border-gray-700 max-w-xl mx-auto mb-10"
      >
        <h3 className="text-xl font-semibold mb-4">➕ Add New Book</h3>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-[#161b22] border border-gray-700 rounded-xl p-4 shadow"
          >
            <img
              src={`http://localhost:4300/${book.image}`} // ✅ If image path is like "uploads/img.jpg"
              alt={book.title}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="font-bold text-lg">{book.title}</h3>
            <p className="text-sm text-gray-400">{book.author}</p>
            <p className="text-sm mt-1">{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksAdmin;
