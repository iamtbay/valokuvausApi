import { Request, Response, NextFunction } from "express";
import { log } from "node:console";
// GET CONTROLLER'S TRY CATCH BLOCK HERE
export const asyncWrapper = (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req,res,next)
    } catch (error) {
      next(error);
    }
  };
};
