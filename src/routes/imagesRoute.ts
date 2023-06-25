import express from "express";
import {
  addNewImage,
  deleteImage,
  editImage,
  getAllImages,
  getCategoryImages,
  getSingleImage,
  getUserImages,
  uploadImg,
} from "../controllers/ImagesController";
import { AuthenticateUser } from "../utils/Authenticate";
export const imageRouter = express.Router();

//GET ALL IMAGES AND ADD IMAGE
imageRouter.route("/").get(getAllImages).post(AuthenticateUser, addNewImage);
//GET SINGLE IMAGE,PATCH AND DELETE
imageRouter
  .route("/photo/:id")
  .get(getSingleImage)
  .patch(AuthenticateUser, editImage)
  .delete(AuthenticateUser, deleteImage);
//GET SINGLE USER IMAGES
imageRouter.route("/photo/user/:id").get(getUserImages);
//GET PHOTOS IN A CATEGORY
imageRouter.route("/photo/category/:category").get(getCategoryImages);
//upload img
imageRouter.route("/photo/uploadPhoto").post(AuthenticateUser, uploadImg);
