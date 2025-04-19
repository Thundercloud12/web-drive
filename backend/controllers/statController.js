
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import Rental from "../models/rentalmodel.js";

export const getStats = async (req, res) => {
  try {
    const [books, users, rentals] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Rental.countDocuments(),
    ]);
    res.json({ books, users, rentals });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};
