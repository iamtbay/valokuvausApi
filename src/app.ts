import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/userRoute";
import { connectDB } from "./db/connectDb";
import { ErrorHandler } from "./errorHandler/ErrorHandler";
import cookieParser from "cookie-parser";
import { imageRouter } from "./routes/imagesRoute";
import { commentsRouter } from "./routes/commentsRouter";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { log } from "console";
import { likeRouter } from "./routes/likesRouter";
import { verifyUser } from "./controllers/userController";
import path from "path";

//VARIABLES
const app = express();
dotenv.config();
const port = process.env.PORT;

//MIDDLEWARES
app.use("/svimg", express.static(path.join(__dirname, "./public")));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(fileUpload());

//ROUTES
app.use("/user", userRouter);
app.use("/api/v1/explore", imageRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/likes", likeRouter);
//

//error handler
app.use(ErrorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    app.listen(port, () => {
      console.log(`app started on port ${port}`);
    });
  } catch (error) {
    console.log("error");
  }
};
start();
