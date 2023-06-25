import { Request, Response, NextFunction } from "express";
import { createError } from "../errorHandler/createError";
import ImageModel from "../models/ImageModel";
import mongoose from "mongoose";
import { UploadedFile } from "express-fileupload";
import path from "path";
import User from "../models/userModel";
import { unlink } from "node:fs/promises";
import Comments from "../models/Comments";
import Likes from "../models/Likes";
import { asyncWrapper } from "../utils/asyncWrapper";
// ADD IMAGE / COMPLETED
export const addNewImage = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPhotoInfos, photoPath } = req.body;
  const values = {
    userId: req.user?.userId,
    tags: newPhotoInfos.tags.split(","),
    category: newPhotoInfos.category,
    desc: newPhotoInfos.desc,
    title: newPhotoInfos.title,
    device: newPhotoInfos.device,
    location: newPhotoInfos.location,
    photoPath,
  };

  if (!values.category)
    return next(createError(401, "Please fill the required areas"));

  const newImage = await ImageModel.create(values);
  return res.status(200).json(newImage);
});

//UPLOAD IMG//
export const uploadImg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let userPhoto = req.files?.image as UploadedFile;
  const extension = userPhoto.name.split(".");

  userPhoto.name =
    req.user?.username +
    Date.now().toString() +
    "." +
    extension[extension.length - 1];
  const imgPath = path.join(
    __dirname,
    "../public/uploads/" + `${userPhoto.name}`
  );
  await userPhoto?.mv(imgPath, (err: any) => {
    if (err) {
      next(createError(404, "error while img uploading"));
    }
  });
  const getFullUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}`;
  return res
    .status(200)
    .json({ image: { src: `${getFullUrl}/svimg/uploads/${userPhoto.name}` } });
};

//DELETE IMAGE
export const deleteImage = asyncWrapper(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(createError(404, "Unvalid id."));

    const image = await ImageModel.findOne({ _id: id });
    if (!image) return next(createError(404, "Unvalid id."));
    if (image.userId.toString() !== req.user?.userId)
      return next(createError(404, "Unauthenticated!"));
    const deleteImageName = image.photoPath.split("/");
    try {
      await unlink(
        __dirname +
          "/../public/uploads/" +
          deleteImageName[deleteImageName.length - 1]
      );
      await Comments.deleteMany({ imageId: id });
      await Likes.deleteMany({ imageId: id });
    } catch (error) {
      console.log(error);
    }
    const deletedImg = await image.deleteOne();
    return res
      .status(200)
      .json({ msg: "Successfully deleted", info: deletedImg });
 
});

//EDIT IMAGE
export const editImage = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(createError(401, "id required"));
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(401, "Unvalid id"));
    const image = await ImageModel.findOne({ _id: id });
    if (!image) return next(createError(401, "Unvalid id"));
    if (image.userId.toString() !== req.user?.userId)
      return next(createError(402, "Unauthenticated!"));
    const updateImage = await image.updateOne({ ...req.body });
    return res.status(200).json({ msg: "Succesfully updated!", updateImage });
  }
);

//GET SIGNLE IMAGE
export const getSingleImage = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(404, "Unvalid id"));

    const singleImg = await ImageModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
          pipeline: [{ $project: { username: 1, _id: 0 } }],
        },
      },
    ]);
    if (!singleImg) return next(createError(404, "Unvalid id"));
    return res.status(200).json({ success: true, data: singleImg[0] });
  }
);
//===================
//GET ALL IMAGES
export const getAllImages = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const allImages = await ImageModel.aggregate([
      {
        $lookup: {
          from: "users",
          as: "userInfo",
          localField: "userId",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1, _id: 0 } }],
        },
      },
    ]);
    return res.status(200).json({ success: true, data: allImages });
  }
);

//GET SINGLE USER IMAGES
export const getUserImages = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(createError(401, "Unvalid id"));
    //const images = await ImageModel.find({ userId: id });
    const images = await ImageModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          as: "userInfo",
          foreignField: "_id",
          localField: "userId",
          pipeline: [{ $project: { username: 1, _id: 0 } }],
        },
      },
    ]);
    if (images.length < 1) return next(createError(401, "User has no image"));
    return res.status(200).json(images);
  }
);

//GET CATEGORY IMAGES
export const getCategoryImages = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("get category images");
  }
);
