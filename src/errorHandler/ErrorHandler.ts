import { Response, Request, NextFunction } from "express";

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const defaultError = {
    statusCode: err.status || 500,
    message: err.message || "Something went wrong...",
  };
  return res
    .status(defaultError.statusCode)
    .json({ msg: defaultError.message });
};
