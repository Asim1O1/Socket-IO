import User from "../models/user.model.js";
import responseFormatter from "../utils/responseFormatter.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    return responseFormatter(
      res,
      200,
      "All users except the current user",
      filteredUsers
    );
  } catch (error) {
    console.error(
      "The error occured while getting user for side bar  ",
      error.message
    );
    return next(createError(500, "Internal Server Error"));
  }
};
