import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return next(createError(401, "No token provided, unauthorized"));
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        return next(createError(401, "Invalid or expired token"));
      }

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(createError(404, "User not found"));
      }

      req.user = user;

      next();
    });
  } catch (error) {
    console.error("Error occurred while protecting route:", error);
    next(createError(500, "Internal Server Error"));
  }
};

export default protectRoute;
