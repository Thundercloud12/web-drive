import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Signup() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [surname, setSurname] = useState("");
  const [feesReceiptNo, setFeesReceiptNo] = useState("");
  const [email, setEmail] = useState("");
  const [idCardImage, setIdCardImage] = useState(null);
  const [submit, setSubmit] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be less than 2MB!");
      return;
    }
    setIdCardImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("surname", surname);
    formData.append("feesReceiptNo", feesReceiptNo);
    formData.append("email", email);
    formData.append("idCardImage", idCardImage);
    formData.append("folderName", "users");

    try {
      const res = await axios.post(
        "http://localhost:4300/api/v1/users/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed. Try again!");
    }

    setSubmit(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-[#e7dac7] to-[#c2a27a] mt-10 w-full h-full">
      <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-[#c2a27a]">
        <h2 className="text-center text-3xl font-serif font-bold text-[#4a3628] mb-4">
          Create an Account
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Join the library and explore a world of knowledge.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-[#c2a27a]"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Surname</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-[#c2a27a]"
              placeholder="Enter your surname"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Fees Receipt No</label>
            <input
              type="text"
              value={feesReceiptNo}
              onChange={(e) => setFeesReceiptNo(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-[#c2a27a]"
              placeholder="Enter your receipt number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-[#c2a27a]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Upload ID Card</label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-[#c2a27a]"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              submit
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-[#6b4f37] text-white hover:bg-[#4a3628]"
            }`}
            disabled={submit}
          >
            {submit ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6b4f37] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
