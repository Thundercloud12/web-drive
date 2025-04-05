import { Router } from "express";
import { adminLogin, fetchUnverifiedUsers, login, registerUser, verifySignedUpUsers } from "../controllers/user.controller.js";
import upload from "../middleware/uploadfile.middleware.js";
import { addBook, fetchAllBooks, getUsersWithRentals, pendingBooks } from "../controllers/functionality.controller.js";

const router = Router()

router.post("/register", upload.single("idCardImage"), registerUser)
router.post("/login", login);
router.post("/login/admin", adminLogin)
router.post("/users/verify-signed-up-user", verifySignedUpUsers)
router.post("/users/fetch-notverified-users", fetchUnverifiedUsers)
router.get("/admin/with-rentals", getUsersWithRentals);
router.get("/books", fetchAllBooks)
router.get("/books/add", fetchAllBooks)
router.post("/rentals/issue",upload.single("image"),addBook )
router.post("/rentals/pending", pendingBooks)
router.patch("/rentals/update-status/:id")

export default router