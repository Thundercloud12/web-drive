import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Admin from "../models/admin.model.js";
import Book from "../models/bookModel.js";
import Rental from "../models/rentalmodel.js";

// ✅ Fetch All Books
const fetchAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (error) {
    console.log("Error in fetching books", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Verified Users With Rental Count
const getUsersWithRentals = async (req, res) => {
  try {
    const users = await User.find({ isVerified: true });

    const usersWithCount = await Promise.all(
      users.map(async (user) => {
        const count = await Rental.countDocuments({
          user: user._id,
          status: { $in: ["approved", "collected"] },
        });

        return {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          surname: user.surname,
          email: user.email,
          issuedCount: count,
        };
      })
    );

    res.status(200).json(usersWithCount);
  } catch (err) {
    console.error("Error fetching users with rentals:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ New Rental Issue Request
const newIssue = async (req, res) => {
  const { ISBN } = req.body;
  const userId = req.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const book = await Book.findOne({ ISBN });
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.quantity <= 0) {
      return res.status(400).json({ message: "Sorry, all available books are rented out!" });
    }

    const newRental = new Rental({
      user: user._id,
      book: book._id,
      status: "pending",
      requestDate: new Date(),
    });

    await newRental.save();

    res.status(201).json({ message: "Rental request processed successfully" });
  } catch (err) {
    console.log("Error in newIssue:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Add New Book
const addBook = async (req, res) => {
  const { title, author, description, quantity, ISBN } = req.body;

  try {
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const imageUrl = `/uploads/${req.file.filename}`;

    const newBook = new Book({
      title,
      author,
      description,
      quantity,
      ISBN,
      imageUrl: req.file.path,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.log("Error in addBook:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBook = async (req,res) => {
  const {ISBN} = req.body;
  try {
    const book = await Book.findOne({ISBN});
    console.log(book);
    
    if(!book) return res.status(401).json({message: "No Such Book exists"});
    await Book.findOneAndDelete({ISBN});
    return res.status(201).json({message: "Book deleted successfully"})
  } catch (error) {
    console.log("Error in deleteBook", error);
    res.status(500).json({message: "Internal Server Error"})
    
  }
}


const pendingBooks = async (req, res) => {
  try {
    const users = await Rental.find({
      status: { $in: ["pending", "approved"] }
    }).populate("user").populate("book");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in pendingBooks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const collectedModal = async (req, res) => {
  try {
    const users = await Rental.find({
      status: "collected"
    }).populate("user").populate("book");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in pendingBooks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const closeRentalIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    if (rental.status !== "collected") {
      return res.status(400).json({ message: "Rental is not in collected state" });
    }

    // Update book quantity
    const book = await Book.findById(rental.book);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    // Delete rental record after book update
    await Rental.findByIdAndDelete(id);

    res.status(200).json({ message: "Rental successfully closed and deleted" });
  } catch (error) {
    console.error("Error closing rental:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const updateRentalStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const rental = await Rental.findById(id).populate("book user");
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    let updatedStatus;

    switch (rental.status) {
      case "pending":
        // Check if book quantity is still available before approving
        if (rental.book.quantity <= 0) {
          return res.status(400).json({ message: "No available copies of this book" });
        }

        rental.status = "approved";
        updatedStatus = "approved";

        // Reduce book quantity by 1
        rental.book.quantity -= 1;
        await rental.book.save();

        break;

      case "approved":
        rental.status = "collected";
        rental.collectedDate = new Date();
        updatedStatus = "collected";
        break;

      case "collected":
        rental.status = "returned";
        rental.returnedDate = new Date();
        updatedStatus = "returned";

        // Optional: Restore quantity when returned
        rental.book.quantity += 1;
        await rental.book.save();
        break;

      default:
        return res.status(400).json({ message: "Invalid status transition" });
    }

    await rental.save();

    res.status(200).json({
      message: `Rental status updated to ${updatedStatus}`,
      rental,
    });
  } catch (error) {
    console.log("Error in updateRentalStatus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// ✅ Export All Controllers
export {
  getUsersWithRentals,
  fetchAllBooks,
  newIssue,
  addBook,
  pendingBooks,
  updateRentalStatus,
  collectedModal,
  closeRentalIssue,
  deleteBook,
};
