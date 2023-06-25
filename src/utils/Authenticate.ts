import { Request, Response, NextFunction } from "express";
import { createError } from "../errorHandler/createError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { log } from "console";
//INTERFACE
//CHECK USER LOGGED IN OR NOT IF USER EXIST GET REQ.USER WITH USER'S INFOS
//FUNCTION
export const AuthenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentToken = req.cookies.accessToken;
  if (!currentToken) return next(createError(404, "Have to login!"));
  try {
    const payload = jwt.verify(
      currentToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!payload) {
      return next(createError(404, "Unauthenticated!"));
    }
    req.user = {
      username: payload.username,
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch (error) {
    next(createError(401, "Authentication invalid!"));
  }
};
