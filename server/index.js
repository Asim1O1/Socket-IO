import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import ConnectToMongoDB from "./db/connectToMongoDb.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config({ path: "../.env" });
const port = process.env.PORT;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Chat app's api.....");
});

app.use(errorHandler);

app.listen(port, () => {
  ConnectToMongoDB();
  console.log("Server listening on port", port, ".....");
});
