"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRouter = void 0;
const express_1 = __importDefault(require("express"));
const ImagesController_1 = require("../controllers/ImagesController");
const Authenticate_1 = require("../utils/Authenticate");
exports.imageRouter = express_1.default.Router();
//GET ALL IMAGES AND ADD IMAGE
exports.imageRouter.route("/").get(ImagesController_1.getAllImages).post(Authenticate_1.AuthenticateUser, ImagesController_1.addNewImage);
//GET SINGLE IMAGE,PATCH AND DELETE
exports.imageRouter
    .route("/photo/:id")
    .get(ImagesController_1.getSingleImage)
    .patch(Authenticate_1.AuthenticateUser, ImagesController_1.editImage)
    .delete(Authenticate_1.AuthenticateUser, ImagesController_1.deleteImage);
//GET SINGLE USER IMAGES
exports.imageRouter.route("/photo/user/:id").get(ImagesController_1.getUserImages);
//GET PHOTOS IN A CATEGORY
exports.imageRouter.route("/photo/category/:category").get(ImagesController_1.getCategoryImages);
//upload img
exports.imageRouter.route("/photo/uploadPhoto").post(Authenticate_1.AuthenticateUser, ImagesController_1.uploadImg);
