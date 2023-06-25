import { Request, Response, NextFunction } from "express";
import { createError } from "../errorHandler/createError";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncWrapper } from "../utils/asyncWrapper";
//HEALTH CHECK
export const healthCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("hello healthcheck");
};
export const getSingleUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    console.log(user); // delete later
    if (!user) return next(createError(404, "user has not found"));
    return res.status(200).json({ success: true, username: user.username });
  }
);

//LOGIN USER
export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    //check email is registered or not
    const checkUser = await User.findOne({ email });
    //If user hasn't registered send an error
    if (!checkUser) return next(createError(401, "Invalid email or password."));
    //If user exist check password true or not.
    const checkPasswordFn = async (): Promise<boolean> => {
      const checker = await bcrypt.compare(password, checkUser.password);
      return checker;
    };
    const checkPassword = await checkPasswordFn();
    //if password is wrong send an error.
    if (!checkPassword)
      return next(createError(401, "Invalid email or password."));
    //if true continue
    const createJWT = () =>
      jwt.sign(
        {
          userId: checkUser._id,
          username: checkUser.username,
          email: checkUser.email,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );
    const token = await createJWT();

    return res
      .cookie("accessToken", token)
      .status(200)
      .json({ msg: "Succesfully logged" });
  }
);

//REGISTER USER
export const register = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) return next(createError(401, "user already registered"));
    //DO NOT RETURN PASSWORD !
    const newUser = await User.create(req.body);
    const { username } = newUser;
    return res
      .status(200)
      .json({ success: true, msg: `Succesfully registered ${username}` });
  }
);

//LOGOUT USER
export const logout = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    req.user = undefined;
    res
      .cookie("accessToken", "")
      .status(200)
      .json({ msg: "Succesfully sign out" });
  }
);
//UPDATE USER
export const updateUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, newEmail } = req.body;
    if (!email || !username || !newEmail)
      return next(createError(401, "Fill the forms!"));
    if (email !== req.user?.email)
      return next(createError(404, "UNAUTHENTICATED !!!"));
    const findEmail = await User.findOne({ email });
    if (!findEmail) return next(createError(401, "E-mail have not finded."));
    const newInfos = await findEmail.updateOne({ username, email: newEmail });
    return res.status(200).json({ msg: newInfos });
  }
);

//VERIFY USER
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).json({ status: true, user: req.user });
};
