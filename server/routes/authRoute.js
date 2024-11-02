import express from "express";
import {
  LoginUser,
  LogoutUser,
  SignupUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", SignupUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);

export default router;
