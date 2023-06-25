import { Request, Response, NextFunction } from "express";
import { createError } from "../errorHandler/createError";
import { IAuthUser } from "./types";
import { log } from "console";
import Comments from "../models/Comments";
//CHECK USER IS AUTHENTICATE TO DO ANYTHING OR NOT

export const AuthUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);

  try {
    const findImg = await Comments.findOne({ _id: id });
    if (findImg?.userId.toString() !== req.user?.userId)
      return next(createError(404, "Unauthorized user!"));
    next();
  } catch (error) {
    next(createError(401, "Unauthorized user!"));
  }
};
