import jwt from "jsonwebtoken";

const generateAuthTokenAndSetCookie = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
  } catch (error) {
    console.error("Error generating token", error.message);
    throw new Error("Failed to generate authentication token");
  }
};

export default generateAuthTokenAndSetCookie;
