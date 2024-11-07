import createError from "http-errors";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateAuthTokenAndSetCookie from "../utils/generateToken.js";
import { loginSchema } from "../middlewares/validation_schema.js";
import authSchema from "../middlewares/validation_schema.js";
import responseFormatter from "../utils/responseFormatter.js";

// Signup User
export const SignupUser = async (req, res, next) => {
  try {
    await authSchema.validateAsync(req.body);
    const { fullName, userName, email, password, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, "User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    return responseFormatter(res, 201, "User registered successfully", {
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
      return next(createError(400, error.details[0].message));
    }
    next(error);
  }
};

// Login User
export const LoginUser = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Invalid email or password");
    }

    generateAuthTokenAndSetCookie(user._id, res);

    return responseFormatter(res, 200, "Login successful", {
      user: {
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    if (error.isJoi) {
      return next(createError(400, error.details[0].message));
    }
    next(error);
  }
};
// Logout User
export const LogoutUser = (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return responseFormatter(res, 200, "Logged out successfully", {});
  } catch (error) {
    console.error("Error while logging out:", error.message);
    next(createError(500, "Internal Server Error"));
  }
};
