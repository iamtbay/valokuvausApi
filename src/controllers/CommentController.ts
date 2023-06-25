import { Request, Response, NextFunction } from "express";
import Comments from "../models/Comments";
import { createError } from "../errorHandler/createError";
import mongoose from "mongoose";
import { error, log } from "console";
import { asyncWrapper } from "../utils/asyncWrapper";
import ImageModel from "../models/ImageModel";

//GET IMAGE'S COMMENTS
export const getImageComments = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(401, "Unvalid id"));

    const comments = await Comments.aggregate([
      { $match: { imageId: id } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1, _id: 0 } }],
          as: "userInfo",
        },
      },
    ]);
    if (!comments) return next(createError(401, "Unvalid comment id"));
    if (comments.length < 1) {
      return res
        .status(200)
        .json({ success: false, msg: "No comments on this image" });
    }
    return res.status(200).json({ success: true, data: comments });
  }
);

// GET SINGLE USER COMMENTS
export const getUserComments = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(401, "Unvalid id"));
    const userComment = await Comments.find({ userId: id });
    if (!userComment)
      return res.status(200).json({ msg: "User has no comment" });
    console.log(userComment);

    return res.status(200).json(userComment);
  }
);

//ADD A NEW COMMENT
export const addNewComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const findImg = await ImageModel.findOne({ _id: id });
    if (!findImg) return next(createError(404, "Image can't found"));
    const { comment, rating } = req.body;
    const values = {
      userId: req.user?.userId,
      imageId: id,
      ...req.body,
    };
    if (!id || !comment || !rating)
      return next(createError(401, "Fill the all lines"));

    const newComment = await Comments.create(values);
    return res.status(200).json(newComment);
  }
);

//EDIT/PATCH A COMMENT
export const patchComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const findImgAndUpdate = await Comments.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (!findImgAndUpdate) return next(createError(401, "Unvalid id"));
    // const updatedOne = await findImg.updateOne({ ...req.body });
    return res.status(200).json(findImgAndUpdate);
  }
);

//DELETE A COMMENT
export const deleteComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const findDeleteItem = await Comments.findOneAndDelete({ _id: id });
    if (!findDeleteItem) return next(createError(404, "Unvalid id!"));
    return res.status(200).json({
      status: true,
      msg: `${findDeleteItem.userId}'s comment deleted succesfully`,
    });
  }
);

export const getSingleComment = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const singleComment = await Comments.findOne({ _id: id });
    if (!singleComment) return next(createError(401, "Unvalid id"));

    return res.status(200).json(singleComment);
  }
);

/* export const getSingleComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const singleComment = await Comments.findOne({ _id: id });
    if (!singleComment) return next(createError(401, "Unvalid id"));
    const deneme = await Comments.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1, _id: 0 } }],
          as: "userInfo",
        },
      },
    ]);
    return res.status(200).json(deneme);

    // return res.status(200).json(singleComment);
  } catch (error) {
    next(error);
  }
}; */
