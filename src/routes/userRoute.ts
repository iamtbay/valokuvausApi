import express from "express";
import {
  getSingleUser,
  healthCheck,
  login,
  logout,
  register,
  updateUser,
  verifyUser,
} from "../controllers/userController";
import { AuthenticateUser } from "../utils/Authenticate";

export const userRouter = express.Router();

userRouter.route("/").get(healthCheck).post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/register").post(register);
userRouter.route("/verify").get(AuthenticateUser, verifyUser);
userRouter
  .route("/settings/:id")
  .get(getSingleUser)
  .patch(AuthenticateUser, updateUser);
