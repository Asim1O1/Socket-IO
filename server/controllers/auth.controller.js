import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateAuthTokenAndSetCookie from "../utils/generateToken.js";
import { loginSchema } from "../middlewares/validation_schema.js";
import authSchema from "../middlewares/validation_schema.js";

export const SignupUser = async (req, res) => {
  try {
    await authSchema.validateAsync(req.body);

    const { fullName, userName, email, password, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set profile picture URL based on gender
    const profilePicture =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${userName}`
        : `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
      gender,
      profilePicture,
    });

    await newUser.save();
    generateAuthTokenAndSetCookie(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.error("The error occurred while signing up:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login User
export const LoginUser = async (req, res) => {
  try {
    await loginSchema.validateAsync(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateAuthTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.error("Error while logging in:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const LogoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error while logging out:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
