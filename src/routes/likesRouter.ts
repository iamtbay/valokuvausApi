import express from "express";
import {
  addLike,
  deleteLike,
  getAllLikes,
  getPhotosLikes,
  getUserLikes,
} from "../controllers/LikesController";
import { AuthenticateUser } from "../utils/Authenticate";

export const likeRouter = express.Router();

likeRouter.route("/like").get(getAllLikes);
likeRouter
  .route("/like/:id")
  .get(getPhotosLikes)
  .post(AuthenticateUser, addLike)
  .delete(AuthenticateUser, deleteLike);
likeRouter.route("/like/user/:id").get(getUserLikes);
