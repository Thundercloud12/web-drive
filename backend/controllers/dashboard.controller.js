// controllers/dashboard.controller.js
import Admin from "../models/admin.model.js";
import User from "../models/userModel.js";
import Rental from "../models/rentalmodel.js";

export const getAdminDashboardData = async (req, res) => {
  try {
    const users = await User.find().countDocuments();
    const rentals = await Rental.find().countDocuments();
    const books = await Rental.find().distinct("book");

    res.status(200).json({
      totalUsers: users,
      totalRentals: rentals,
      totalBooksIssued: books.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin dashboard data", error });
  }
};

export const getUserDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;

    const rentals = await Rental.find({ user: userId }).populate("book");

    res.status(200).json({
      totalRentals: rentals.length,
      books: rentals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user dashboard data", error });
  }
};
