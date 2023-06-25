"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const Authenticate_1 = require("../utils/Authenticate");
exports.userRouter = express_1.default.Router();
exports.userRouter.route("/").get(userController_1.healthCheck).post(userController_1.login);
exports.userRouter.route("/logout").get(userController_1.logout);
exports.userRouter.route("/register").post(userController_1.register);
exports.userRouter.route("/verify").get(Authenticate_1.AuthenticateUser, userController_1.verifyUser);
exports.userRouter
    .route("/settings/:id")
    .get(userController_1.getSingleUser)
    .patch(Authenticate_1.AuthenticateUser, userController_1.updateUser);
