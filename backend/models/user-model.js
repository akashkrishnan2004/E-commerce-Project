import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // username: { type: String, required: true, unique: true },
  username: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores.",
    ],
  },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  emailOTP: { type: String },
  otpExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
