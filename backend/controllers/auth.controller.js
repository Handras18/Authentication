import { User } from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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
    const verificationExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const user = new User({
      email,
      password,
      name,
      verificationToken,
      verificationExpiresAt,
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({ message: "User successfully created" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const login = async (req, res) => {
  res.send("login route");
};
export const logout = async (req, res) => {
  res.send("logout route");
};
