"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleComment = exports.deleteComment = exports.patchComment = exports.addNewComment = exports.getUserComments = exports.getImageComments = void 0;
const Comments_1 = __importDefault(require("../models/Comments"));
const createError_1 = require("../errorHandler/createError");
const mongoose_1 = __importDefault(require("mongoose"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const ImageModel_1 = __importDefault(require("../models/ImageModel"));
//GET IMAGE'S COMMENTS
exports.getImageComments = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next((0, createError_1.createError)(401, "Unvalid id"));
    const comments = yield Comments_1.default.aggregate([
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
    if (!comments)
        return next((0, createError_1.createError)(401, "Unvalid comment id"));
    if (comments.length < 1) {
        return res
            .status(200)
            .json({ success: false, msg: "No comments on this image" });
    }
    return res.status(200).json({ success: true, data: comments });
}));
// GET SINGLE USER COMMENTS
exports.getUserComments = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next((0, createError_1.createError)(401, "Unvalid id"));
    const userComment = yield Comments_1.default.find({ userId: id });
    if (!userComment)
        return res.status(200).json({ msg: "User has no comment" });
    console.log(userComment);
    return res.status(200).json(userComment);
}));
//ADD A NEW COMMENT
exports.addNewComment = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const findImg = yield ImageModel_1.default.findOne({ _id: id });
    if (!findImg)
        return next((0, createError_1.createError)(404, "Image can't found"));
    const { comment, rating } = req.body;
    const values = Object.assign({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, imageId: id }, req.body);
    if (!id || !comment || !rating)
        return next((0, createError_1.createError)(401, "Fill the all lines"));
    const newComment = yield Comments_1.default.create(values);
    return res.status(200).json(newComment);
}));
//EDIT/PATCH A COMMENT
exports.patchComment = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const findImgAndUpdate = yield Comments_1.default.findOneAndUpdate({ _id: id }, Object.assign({}, req.body));
    if (!findImgAndUpdate)
        return next((0, createError_1.createError)(401, "Unvalid id"));
    // const updatedOne = await findImg.updateOne({ ...req.body });
    return res.status(200).json(findImgAndUpdate);
}));
//DELETE A COMMENT
exports.deleteComment = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const findDeleteItem = yield Comments_1.default.findOneAndDelete({ _id: id });
    if (!findDeleteItem)
        return next((0, createError_1.createError)(404, "Unvalid id!"));
    return res.status(200).json({
        status: true,
        msg: `${findDeleteItem.userId}'s comment deleted succesfully`,
    });
}));
exports.getSingleComment = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const singleComment = yield Comments_1.default.findOne({ _id: id });
    if (!singleComment)
        return next((0, createError_1.createError)(401, "Unvalid id"));
    return res.status(200).json(singleComment);
}));
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
