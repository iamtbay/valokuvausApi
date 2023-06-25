"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const CommentController_1 = require("../controllers/CommentController");
const Authenticate_1 = require("../utils/Authenticate");
const AuthUser_1 = require("../utils/AuthUser");
exports.commentsRouter = express_1.default.Router();
exports.commentsRouter.route("/").post(Authenticate_1.AuthenticateUser, CommentController_1.addNewComment);
exports.commentsRouter
    .route("/:id")
    .get(CommentController_1.getImageComments)
    .post(Authenticate_1.AuthenticateUser, CommentController_1.addNewComment);
exports.commentsRouter
    .route("/singleComment/:id")
    .get(CommentController_1.getSingleComment)
    .patch(Authenticate_1.AuthenticateUser, AuthUser_1.AuthUser, CommentController_1.patchComment)
    .delete(Authenticate_1.AuthenticateUser, AuthUser_1.AuthUser, CommentController_1.deleteComment);
exports.commentsRouter.route("/user/:id").get(CommentController_1.getUserComments);
