import express from "express";
import {
  LoginUser,
  LogoutUser,
  SignupUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signup", SignupUser);
router.get("/login", LoginUser);
router.get("/logout", LogoutUser);

export default router;
