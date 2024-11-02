import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const SignupUser = async (req, res) => {
  try {
    const { fullName, userName, email, password, confirmPassword, gender } =
      req.body;

    if (
      !fullName ||
      !userName ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //https://avatar.iran.liara.run/public/boy

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName: "fullName",
      userName: "userName",
      email: "email",
      password: hashedPassword,
      gender,
      profilePicture: gender == "male" ? boyProfilePic : girlProfilePic,
    });

    await newUser.save();

    console.log(newUser.profilePicture);
    res.status(201).json({
      message: "User registered successfully",
      _id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("The error occured while signing up is: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("Signup user");
};

export const LoginUser = (req, res) => {
  console.log("Login user");
};
export const LogoutUser = (req, res) => {
  console.log("Logout user");
};
