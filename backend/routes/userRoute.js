import { Router } from "express";
import { adminLogin, fetchUnverifiedUsers, login, registerUser, verifySignedUpUsers } from "../controllers/user.controller.js";
import upload from "../middleware/uploadfile.middleware.js";
import { addBook, closeRentalIssue, collectedModal, fetchAllBooks, getUsersWithRentals, newIssue, pendingBooks, updateRentalStatus } from "../controllers/functionality.controller.js";
import { getAdminDashboardData, getUserDashboardData } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router()

router.get("/admin/dashboard", getAdminDashboardData);
router.get("/user/dashboard/:userId", getUserDashboardData);
router.post("/register", upload.single("idCardImage"), registerUser)
router.post("/login", login);
router.post("/login/admin", adminLogin)
router.post("/verify-signed-up-user", verifySignedUpUsers)
router.get("/fetch-notverified-users", fetchUnverifiedUsers)
router.get("/admin/with-rentals", getUsersWithRentals);
router.get("/books", fetchAllBooks)
router.post("/books/add", upload.single("imageUrl"),  addBook)
router.post("/rentals/issue",authMiddleware, newIssue )
router.get("/rentals/pending", pendingBooks)
router.patch("/rentals/update-status/:id", updateRentalStatus)
router.get("/rentals/collected", collectedModal)
router.put("/rentals/close/:id", closeRentalIssue)


export default router