import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";

dotenv.config({ path: "../.env" });
const port = process.env.PORT;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Chat app's api.....");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log("Server listening on port", port);
});
