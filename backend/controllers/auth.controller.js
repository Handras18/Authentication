import { User } from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const verificationToken = generateVerificationCode();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const user = new User({
      email,
      password,
      name,
      verificationToken,
      verificationTokenExpiresAt,
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({ message: "User successfully created", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    return res.status(201).json({
      success: true,
      message: "User successfully created",
      user: {
        ...user.doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!email) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        ...user.doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in login ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged in successfully" });
};
