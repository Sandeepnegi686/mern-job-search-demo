import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
} from "../controller/authController.js";
import authenticateUser from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.patch("/updateuser", authenticateUser, updateUser);

export default authRouter;
