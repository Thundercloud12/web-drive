import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Admin from "../models/admin.model.js";
import nodemailer from "nodemailer";

// Generate random username and password
const generateRandomCredentials = () => {
  const username = `user${Math.floor(10000 + Math.random() * 90000)}`;
  const password = crypto.randomBytes(5).toString("hex"); // 10 characters
  return { username, password };
};

// Register User
const registerUser = async (req, res) => {
  console.log("📥 Received Body:", req.body);
  console.log("📷 File received:", req.file);

  const { fullname, surname, feesReceiptNo, email } = req.body;

  if (!req.file || !req.file.path) {
    return res.status(400).json({ msg: "ID Card image is not uploaded, please try again" });
  }

  try {
    let user = await User.findOne({ feesReceiptNo, isVerified: true });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({
      fullname,
      surname,
      feesReceiptNo,
      idCardImage: req.file.path, // Cloudinary provides the full URL in `path`
      email
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, isVerified: user.isVerified });
  } catch (err) {

    console.error("❌ Error in registerUser:", err);
    res.status(500).json({ error: err.message });
  }
};


// Login User or Admin
const login = async (req, res) => {
  console.log("🔐 Login Request Body:", req.body);

  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({
        token,
        role: "admin",
        user_id: admin._id
      });
    }


    const user = await User.findOne({ username, isVerified: true });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, isVerified: user.isVerified });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { orgKey} = req.body;

  try {
    if (!orgKey) {
      return res.status(400).json({ message: "Please provide an admin key" });
    }

    const validAdminKeys = process.env.ADMIN_SECRET_KEY.split(",");

    if (!validAdminKeys.includes(orgKey)) {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    const trimmedKey = orgKey.trim();
   const admin = await Admin.findOne({ orgNumber: trimmedKey });

    if (!admin) return res.status(400).json({ message: "Admin not found" });


    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: "admin" });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch Unverified Users
const fetchUnverifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ isVerified: false });
    if (users.length === 0) {
      return res.status(200).json({ message: "No unverified users" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error("❌ Error in fetching unverified users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify a User and Send Email
const verifySignedUpUsers = async (req, res) => {
  const { feesReceiptNo, email } = req.body;

  try {
    const user = await User.findOne({ feesReceiptNo });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const { username, password } = generateRandomCredentials();
    const hashedPassword = await bcrypt.hash(password, 10);

    user.username = username;
    user.password = hashedPassword;
    user.isVerified = true;
    await user.save();

    // Set up transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    transporter.verify((err, success) => {
      if (err) {
        console.error("❌ Email transporter error:", err);
      } else {
        console.log("✅ Email transporter ready:", success);
      }
    });

    const mailOptions = {
      from: `"Web Drive 📂" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account Details - Web Drive",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
          <h1 style="color: #4CAF50;">Welcome to Web Drive 🎉</h1>
          <p>Your account has been successfully verified. Below are your login details:</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
          <a href="http://localhost:5173/login"
            style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Login Now
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: gray;">Please change your password after logging in.</p>
        </div>
      `,
    };

    // Send Email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Failed to send email:", err);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("✅ Email sent:", info.response);
        return res.status(200).json({
          user_id: user._id,
          message: "User verified and credentials sent via email",
        });
      }
    });
  } catch (error) {
    console.error("❌ Error verifying user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  registerUser,
  login,
  generateRandomCredentials,
  verifySignedUpUsers,
  adminLogin,
  fetchUnverifiedUsers,
};
