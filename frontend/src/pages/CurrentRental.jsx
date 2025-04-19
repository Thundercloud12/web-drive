import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const CurrentRental = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rentalsPerPage = 6;

  const { darkMode } = useTheme();

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      const { data } = await axios.get(
        `http://localhost:4300/api/v1/users/my-rentals/${userId}`,
        { withCredentials: true }
      );

      setRentals(data.rentals || []);
    } catch (error) {
      console.error("Error fetching current rentals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const indexOfLastRental = currentPage * rentalsPerPage;
  const indexOfFirstRental = indexOfLastRental - rentalsPerPage;
  const currentRentals = rentals.slice(indexOfFirstRental, indexOfLastRental);
  const totalPages = Math.ceil(rentals.length / rentalsPerPage);

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-[#0d1117] text-white" : "bg-white text-black"} font-['Oxygen']`}>
      <h2 className="text-4xl font-bold text-center mb-8">📚 Your Current Rentals</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading rentals...</p>
      ) : rentals.length === 0 ? (
        <p className="text-center text-gray-400">You don't have any active rentals.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRentals.map((rental) => (
              <motion.div
                key={rental._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`card shadow-lg ${darkMode ? 'bg-[#161b22] border border-gray-700' : 'bg-white border border-gray-300'}`}>
                  <figure className="px-4 pt-4">
                    <img src={rental.book?.imageUrl} alt="Book Cover" className="rounded-xl h-52 object-cover w-full" />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-purple-500">{rental.book?.title}</h2>
                    <p><strong>Author:</strong> {rental.book?.author}</p>
                    <p><strong>Status:</strong> {rental.status}</p>
                    <p><strong>Rented On:</strong> {dayjs(rental.rentedDate).format("DD MMM YYYY")}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="join">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`join-item btn ${currentPage === i + 1 ? 'btn-primary' : darkMode ? 'btn-outline text-white border-gray-600' : 'btn-outline'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentRental;
