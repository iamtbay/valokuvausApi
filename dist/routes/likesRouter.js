"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRouter = void 0;
const express_1 = __importDefault(require("express"));
const LikesController_1 = require("../controllers/LikesController");
const Authenticate_1 = require("../utils/Authenticate");
exports.likeRouter = express_1.default.Router();
exports.likeRouter.route("/like").get(LikesController_1.getAllLikes);
exports.likeRouter
    .route("/like/:id")
    .get(LikesController_1.getPhotosLikes)
    .post(Authenticate_1.AuthenticateUser, LikesController_1.addLike)
    .delete(Authenticate_1.AuthenticateUser, LikesController_1.deleteLike);
exports.likeRouter.route("/like/user/:id").get(LikesController_1.getUserLikes);
