import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

import ConnectToMongoDB from "./db/connectToMongoDb.js";

import errorHandler from "./middlewares/errorHandler.js";

dotenv.config({ path: "../.env" });
const port = process.env.PORT;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Chat app's api.....");
});

app.use(errorHandler);

app.listen(port, () => {
  ConnectToMongoDB();
  console.log("Server listening on port", port, ".....");
});
