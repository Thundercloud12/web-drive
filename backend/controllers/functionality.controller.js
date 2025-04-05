import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Book from "../models/Book.js"
import Rental from "../models/Rental.js";

const fetchAllBooks = async(req,res) => {
   try {
     const books = await Book.find();
     return res.json(books)
   } catch (error) {
    console.log("Error in fetching books", error);
    
   }
}

const getUsersWithRentals = async (req, res) => {
  try {
    const users = await User.find({ isVerified: true });

    const usersWithCount = await Promise.all(
      users.map(async (user) => {
        const count = await Rental.countDocuments({
          user: user._id,
          status: { $in: ["approved", "collected"] }
        });

        return {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          surname: user.surname,
          email: user.email,
          issuedCount: count
        };
      })
    );

    res.status(200).json(usersWithCount);
  } catch (err) {
    console.error("Error fetching users with rentals:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const newIssue = async (req,res) => {
  const {ISBN} = req.body;
  const userId=req.user.id;

  const user = await User.findOne({userId: userId})
  if(!user) return res.status(500).json({ message: "problem in newIssue controller" });
  const books = await Book.findOne({ISBN: ISBN})
   if(!books) return res.status(500).json({ message: "problem in newIssue controller" });
  const newRental = new Rental({
    user: user,
    book: books,
    status: "pending",
    requestDate: new Date()
  })

  await newRental.save()
  res.status(201).json({message: "Rental request processe successfully"})
}

const addBook = async (req,res) => {
  const {title, author, descripiton, quantity, ISBN} = req.body;
  try {
    if(!req.file) return res.json(400).json({error: "Image is required"})
    
    const imageUrl = `/uploads/${req.file.filename}`;

    const newBook = new Book({
      title,
      author,
      descripiton,
      quantity,
      ISBN,
      imageUrl
    })
    await newBook.save();
    res.status(201).json(newBook)
  } catch (error) {
    console.log("Error in add Book", error);
    
  }
}

const pendingBooks = async (req,res) => {
  try {
    const data = User.find({status: "pending"})
    if(!data) return res.status(500).json({message: "Internal server error"})
    return res.status(200).json(data)
  } catch (error) {
    console.log("Error in pending books", error);
    
  }
}

const updateRentalStatus = async (req,res) => {
  const {id} = req.params;
  try {
    const rental = await Rental.findById(id).populate('book user')
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    let updatedStatus;

    // Transition status
    switch (rental.status) {
      case 'pending':
        rental.status = 'approved';
        updatedStatus = 'approved';
        break;
      case 'approved':
        rental.status = 'collected';
        rental.collectedDate = new Date();
        updatedStatus = 'collected';
        break;
      case 'collected':
        rental.status = 'returned';
        rental.returnedDate = new Date();
        updatedStatus = 'returned';
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
    console.log("Error in updateRentalStatus", error);
    
  }
}

export  {getUsersWithRentals, fetchAllBooks, newIssue, addBook, pendingBooks}