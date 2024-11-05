import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authSchema from "../middlewares/validation_schema.js";

export const SignupUser = async (req, res) => {
  try {
    // Validate request body using Joi schema
    await authSchema.validateAsync(req.body);

    const { fullName, userName, email, password, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set profile picture URL based on gender
    const profilePicture =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${userName}`
        : `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    // Create new user
    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
      gender,
      profilePicture,
    });

    // Save new user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({
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
      // Handle Joi validation errors
      return res.status(400).json({ message: error.details[0].message });
    }
    console.error("The error occurred while signing up:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LoginUser = (req, res) => {
  console.log("Login user");
};
export const LogoutUser = (req, res) => {
  console.log("Logout user");
};
