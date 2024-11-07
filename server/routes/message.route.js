import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);

export default router;
