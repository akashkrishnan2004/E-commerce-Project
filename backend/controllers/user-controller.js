import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user-model.js";
import { sendEmailOTP, generateOTP } from "../utils/emailService.js";
import { json } from "express";

// Register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, profileImage, password } =
      req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const emailOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      profileImage,
      password: hashedPassword,
      emailOTP,
      otpExpiresAt: otpExpiry,
      isEmailVerified: false,
    });

    await newUser.save();
    console.log("New user registered:", newUser._id);

    // Send OTP Email
    try {
      await sendEmailOTP(email, emailOTP);
    } catch (error) {
      console.error("Error sending OTP:", error);
      await User.findByIdAndDelete(newUser._id); // Delete user if OTP fails
      return res
        .status(500)
        .json({ message: "Failed to send OTP. Please try again." });
    }

    res.status(201).json({
      message: "User registered. Email OTP sent.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// OTP Verification
export const verifyOTP = async (req, res) => {
  try {
    const { email, emailOTP } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Check if OTP is valid and not expired
    if (
      !user.emailOTP ||
      user.emailOTP !== emailOTP ||
      new Date() > user.otpExpiresAt
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailOTP = null; // Clear OTP after successful verification
    user.otpExpiresAt = null; // Clear OTP expiry
    await user.save();

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Generate new OTP
    const emailOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    user.emailOTP = emailOTP;
    user.otpExpiresAt = otpExpiry;
    await user.save();

    await sendEmailOTP(email, emailOTP);

    res.status(200).json({ message: "New OTP sent to your email!" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Email not verified. Please verify your email." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "All users found", users });
  } catch (error) {
    res.status(500).json({ message: "Users not found", error });
  }
};

// get user by id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// send-otp
export const sendOTPForPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const emailOTP = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.emailOTP = emailOTP;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendEmailOTP(email, emailOTP);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in send-otp:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// reset-password
export const resetPassword = async (req, res) => {
  const { email, emailOTP, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      !user.emailOTP ||
      user.emailOTP !== emailOTP ||
      new Date() > user.otpExpiresAt
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.emailOTP = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// update user profile
export const updateUserProfile = async (req, res) => {
  const { firstName, lastName, username, profileImage } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.profileImage = profileImage || user.profileImage;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
