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
exports.getCategoryImages = exports.getUserImages = exports.getAllImages = exports.getSingleImage = exports.editImage = exports.deleteImage = exports.uploadImg = exports.addNewImage = void 0;
const createError_1 = require("../errorHandler/createError");
const ImageModel_1 = __importDefault(require("../models/ImageModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("node:fs/promises");
const Comments_1 = __importDefault(require("../models/Comments"));
const Likes_1 = __importDefault(require("../models/Likes"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
// ADD IMAGE / COMPLETED
exports.addNewImage = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { newPhotoInfos, photoPath } = req.body;
    const values = {
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        tags: newPhotoInfos.tags.split(","),
        category: newPhotoInfos.category,
        desc: newPhotoInfos.desc,
        title: newPhotoInfos.title,
        device: newPhotoInfos.device,
        location: newPhotoInfos.location,
        photoPath,
    };
    if (!values.category)
        return next((0, createError_1.createError)(401, "Please fill the required areas"));
    const newImage = yield ImageModel_1.default.create(values);
    return res.status(200).json(newImage);
}));
//UPLOAD IMG//
const uploadImg = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    let userPhoto = (_b = req.files) === null || _b === void 0 ? void 0 : _b.image;
    const extension = userPhoto.name.split(".");
    userPhoto.name =
        ((_c = req.user) === null || _c === void 0 ? void 0 : _c.username) +
            Date.now().toString() +
            "." +
            extension[extension.length - 1];
    const imgPath = path_1.default.join(__dirname, "../public/uploads/" + `${userPhoto.name}`);
    yield (userPhoto === null || userPhoto === void 0 ? void 0 : userPhoto.mv(imgPath, (err) => {
        if (err) {
            next((0, createError_1.createError)(404, "error while img uploading"));
        }
    }));
    const getFullUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}`;
    return res
        .status(200)
        .json({ image: { src: `${getFullUrl}/svimg/uploads/${userPhoto.name}` } });
});
exports.uploadImg = uploadImg;
//DELETE IMAGE
exports.deleteImage = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next((0, createError_1.createError)(404, "Unvalid id."));
    const image = yield ImageModel_1.default.findOne({ _id: id });
    if (!image)
        return next((0, createError_1.createError)(404, "Unvalid id."));
    if (image.userId.toString() !== ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId))
        return next((0, createError_1.createError)(404, "Unauthenticated!"));
    const deleteImageName = image.photoPath.split("/");
    try {
        yield (0, promises_1.unlink)(__dirname +
            "/../public/uploads/" +
            deleteImageName[deleteImageName.length - 1]);
        yield Comments_1.default.deleteMany({ imageId: id });
        yield Likes_1.default.deleteMany({ imageId: id });
    }
    catch (error) {
        console.log(error);
    }
    const deletedImg = yield image.deleteOne();
    return res
        .status(200)
        .json({ msg: "Successfully deleted", info: deletedImg });
}));
//EDIT IMAGE
exports.editImage = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { id } = req.params;
    if (!id)
        return next((0, createError_1.createError)(401, "id required"));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next((0, createError_1.createError)(401, "Unvalid id"));
    const image = yield ImageModel_1.default.findOne({ _id: id });
    if (!image)
        return next((0, createError_1.createError)(401, "Unvalid id"));
    if (image.userId.toString() !== ((_e = req.user) === null || _e === void 0 ? void 0 : _e.userId))
        return next((0, createError_1.createError)(402, "Unauthenticated!"));
    const updateImage = yield image.updateOne(Object.assign({}, req.body));
    return res.status(200).json({ msg: "Succesfully updated!", updateImage });
}));
//GET SIGNLE IMAGE
exports.getSingleImage = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next((0, createError_1.createError)(404, "Unvalid id"));
    const singleImg = yield ImageModel_1.default.aggregate([
        {
            $match: { _id: new mongoose_1.default.Types.ObjectId(id) },
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
    if (!singleImg)
        return next((0, createError_1.createError)(404, "Unvalid id"));
    return res.status(200).json({ success: true, data: singleImg[0] });
}));
//===================
//GET ALL IMAGES
exports.getAllImages = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allImages = yield ImageModel_1.default.aggregate([
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
}));
//GET SINGLE USER IMAGES
exports.getUserImages = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next((0, createError_1.createError)(401, "Unvalid id"));
    //const images = await ImageModel.find({ userId: id });
    const images = yield ImageModel_1.default.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
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
    if (images.length < 1)
        return next((0, createError_1.createError)(401, "User has no image"));
    return res.status(200).json(images);
}));
//GET CATEGORY IMAGES
exports.getCategoryImages = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("get category images");
}));
