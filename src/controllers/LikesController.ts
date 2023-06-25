import { log } from "console";
import { Request, Response, NextFunction } from "express";
import Likes from "../models/Likes";
import { createError } from "../errorHandler/createError";
import { asyncWrapper } from "../utils/asyncWrapper";

export const addLike = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const checkPhoto = await Likes.findOne({ imageId: id, userId });
    if (checkPhoto) {
      return next(createError(401, "Already liked"));
    }
    const createLike = await Likes.create({ imageId: id, userId });
    return res
      .status(200)
      .json({ success: true, like: createLike, msg: "Liked succesfully" });
  }
);

export const deleteLike = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const checkPhoto = await Likes.findOne({ imageId: id, userId });
    if (!checkPhoto) {
      return next(createError(401, "User didn't like the photo."));
    }
    if (checkPhoto.userId !== userId)
      return res.status(401).json({ msg: "UNAUTHENTICATED !" });
    const deleteIt = await checkPhoto.deleteOne();
    return res.status(200).json({
      success: true,
      deletedLike: deleteIt,
      msg: "Deleted Succesfully",
    });
  }
);
//get all likes
export const getAllLikes = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const getAllLikes = await Likes.find({});
    return res
      .status(200)
      .json({ length: getAllLikes.length, likes: getAllLikes });
  }
);
//GET SINGLE PHOTO'S LIKES
export const getPhotosLikes = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const findPhotosLikes = await Likes.find({ imageId: id });
    if (!findPhotosLikes) return next(createError(404, "No like"));
    res.status(200).json(findPhotosLikes);
  }
);
//get single user all like
export const getUserLikes = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userLikes = await Likes.find({ userId: id });
    if (!userLikes) return next(createError(404, "User doesn't have a like"));
    if (userLikes.length < 1)
      return res.status(200).json({ msg: "user doesn't like any photo" });
    return res.status(200).json({ success: true, userLikes });
  }
);
