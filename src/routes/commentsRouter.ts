import express from "express";
import {
  addNewComment,
  deleteComment,
  getImageComments,
  getSingleComment,
  getUserComments,
  patchComment,
} from "../controllers/CommentController";
import { AuthenticateUser } from "../utils/Authenticate";
import { AuthUser } from "../utils/AuthUser";
export const commentsRouter = express.Router();

commentsRouter.route("/").post(AuthenticateUser, addNewComment);
commentsRouter
  .route("/:id")
  .get(getImageComments)
  .post(AuthenticateUser, addNewComment);
commentsRouter
  .route("/singleComment/:id")
  .get(getSingleComment)
  .patch(AuthenticateUser, AuthUser, patchComment)
  .delete(AuthenticateUser, AuthUser, deleteComment);

commentsRouter.route("/user/:id").get(getUserComments);
