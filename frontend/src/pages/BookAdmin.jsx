import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BooksAdmin = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: "" });

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4300/api/v1/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("author", author);
  formData.append("description", description);
  formData.append("quantity", quantity);
  formData.append("ISBN", ISBN);
  formData.append("image", imageFile); // imageFile is your selected image

  try {
    const response = await axios.post("http://localhost:4300/api/v1/rentals/issue", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Book added:", response.data);
  } catch (error) {
    console.error("Error adding book:", error);
  }
};


  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-[#f6eee4] to-[#d6bfa5] min-h-screen">
      <h2 className="text-3xl text-center text-[#4a3628] font-bold mb-6">Manage Books</h2>

      <div className="bg-white p-4 rounded-xl border border-[#c2a27a] mb-6 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-[#4a3628]">Add New Book</h3>
        <input
          type="text"
          placeholder="Book Title"
          className="input input-bordered w-full mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Book Description"
          className="textarea textarea-bordered w-full mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          className="input input-bordered w-full mb-2"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button className="btn w-full bg-[#6b4f37] text-white hover:bg-[#4a3628]" onClick={handleSubmit}>
          Add Book
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="card shadow-xl bg-white border border-[#c2a27a]">
            <figure><img src={book.image} alt={book.title} className="h-48 object-cover w-full" /></figure>
            <div className="card-body">
              <h2 className="card-title text-[#4a3628]">{book.title}</h2>
              <p className="text-sm text-gray-600 truncate">{book.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksAdmin;
