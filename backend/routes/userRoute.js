import { Router } from "express";
import { verifyToken } from '../middleware/verifyToken.js';
import {
  adminLogin,
  changePassword,
  fetchDetails,
  fetchUnverifiedUsers,
  login,
  registerUser,
  validateToken,
  verifySignedUpUsers,
  getMyRentals,
  adminSignup
} from "../controllers/user.controller.js";
import upload from "../middleware/uploadfile.middleware.js";
import {
  addBook,
  closeRentalIssue,
  collectedModal,
  deleteBook,
  fetchAllBooks,
  getUsersWithRentals,
  newIssue,
  pendingBooks,
  updateRentalStatus,
} from "../controllers/functionality.controller.js";
import { getAdminDashboardData, getUserDashboardData } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Dashboard Routes
router.get("/admin/dashboard", getAdminDashboardData);
router.get("/user/dashboard/:userId", getUserDashboardData);

// User Routes
router.post("/register", upload.single("idCardImage"), registerUser);
router.post("/login", login);
router.post("/login/admin/:id", adminLogin);
router.post("/verify-signed-up-user", verifySignedUpUsers);
router.get("/fetch-notverified-users", fetchUnverifiedUsers);

// Books and Rentals Routes
router.get("/books", fetchAllBooks);
router.post("/books/add", upload.single("imageUrl"), addBook);
router.post("/rentals/issue", authMiddleware, newIssue);
router.get("/rentals/pending", pendingBooks);
router.patch("/rentals/update-status/:id", updateRentalStatus);
router.get("/rentals/collected", collectedModal);
router.put("/rentals/close/:id", closeRentalIssue);
router.get("/admin/with-rentals", getUsersWithRentals);
router.post("/change-password", authMiddleware, changePassword);
router.get("/obtain-user-information/:id", authMiddleware, fetchDetails);
router.delete("/delete-book", authMiddleware, deleteBook);
// Change Password Route - Authenticated and Protected
router.post("/change-password", authMiddleware, changePassword);
router.get("/validate-token", authMiddleware, validateToken)
router.get('/my-rentals/:id', authMiddleware, getMyRentals);
router.post("/admin-signup", adminSignup)


export default router;
