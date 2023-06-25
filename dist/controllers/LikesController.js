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
exports.getUserLikes = exports.getPhotosLikes = exports.getAllLikes = exports.deleteLike = exports.addLike = void 0;
const Likes_1 = __importDefault(require("../models/Likes"));
const createError_1 = require("../errorHandler/createError");
const asyncWrapper_1 = require("../utils/asyncWrapper");
exports.addLike = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const checkPhoto = yield Likes_1.default.findOne({ imageId: id, userId });
    if (checkPhoto) {
        return next((0, createError_1.createError)(401, "Already liked"));
    }
    const createLike = yield Likes_1.default.create({ imageId: id, userId });
    return res
        .status(200)
        .json({ success: true, like: createLike, msg: "Liked succesfully" });
}));
exports.deleteLike = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const checkPhoto = yield Likes_1.default.findOne({ imageId: id, userId });
    if (!checkPhoto) {
        return next((0, createError_1.createError)(401, "User didn't like the photo."));
    }
    if (checkPhoto.userId !== userId)
        return res.status(401).json({ msg: "UNAUTHENTICATED !" });
    const deleteIt = yield checkPhoto.deleteOne();
    return res.status(200).json({
        success: true,
        deletedLike: deleteIt,
        msg: "Deleted Succesfully",
    });
}));
//get all likes
exports.getAllLikes = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllLikes = yield Likes_1.default.find({});
    return res
        .status(200)
        .json({ length: getAllLikes.length, likes: getAllLikes });
}));
//GET SINGLE PHOTO'S LIKES
exports.getPhotosLikes = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const findPhotosLikes = yield Likes_1.default.find({ imageId: id });
    if (!findPhotosLikes)
        return next((0, createError_1.createError)(404, "No like"));
    res.status(200).json(findPhotosLikes);
}));
//get single user all like
exports.getUserLikes = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userLikes = yield Likes_1.default.find({ userId: id });
    if (!userLikes)
        return next((0, createError_1.createError)(404, "User doesn't have a like"));
    if (userLikes.length < 1)
        return res.status(200).json({ msg: "user doesn't like any photo" });
    return res.status(200).json({ success: true, userLikes });
}));
