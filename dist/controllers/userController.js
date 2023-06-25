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
exports.verifyUser = exports.updateUser = exports.logout = exports.register = exports.login = exports.getSingleUser = exports.healthCheck = void 0;
const createError_1 = require("../errorHandler/createError");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
//HEALTH CHECK
const healthCheck = (req, res, next) => {
    res.send("hello healthcheck");
};
exports.healthCheck = healthCheck;
exports.getSingleUser = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userModel_1.default.findOne({ _id: id });
    console.log(user); // delete later
    if (!user)
        return next((0, createError_1.createError)(404, "user has not found"));
    return res.status(200).json({ success: true, username: user.username });
}));
//LOGIN USER
exports.login = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //check email is registered or not
    const checkUser = yield userModel_1.default.findOne({ email });
    //If user hasn't registered send an error
    if (!checkUser)
        return next((0, createError_1.createError)(401, "Invalid email or password."));
    //If user exist check password true or not.
    const checkPasswordFn = () => __awaiter(void 0, void 0, void 0, function* () {
        const checker = yield bcryptjs_1.default.compare(password, checkUser.password);
        return checker;
    });
    const checkPassword = yield checkPasswordFn();
    //if password is wrong send an error.
    if (!checkPassword)
        return next((0, createError_1.createError)(401, "Invalid email or password."));
    //if true continue
    const createJWT = () => jsonwebtoken_1.default.sign({
        userId: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    const token = yield createJWT();
    return res
        .cookie("accessToken", token)
        .status(200)
        .json({ msg: "Succesfully logged" });
}));
//REGISTER USER
exports.register = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const checkUser = yield userModel_1.default.findOne({ email });
    if (checkUser)
        return next((0, createError_1.createError)(401, "user already registered"));
    //DO NOT RETURN PASSWORD !
    const newUser = yield userModel_1.default.create(req.body);
    const { username } = newUser;
    return res
        .status(200)
        .json({ success: true, msg: `Succesfully registered ${username}` });
}));
//LOGOUT USER
exports.logout = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.user = undefined;
    res
        .cookie("accessToken", "")
        .status(200)
        .json({ msg: "Succesfully sign out" });
}));
//UPDATE USER
exports.updateUser = (0, asyncWrapper_1.asyncWrapper)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, email, newEmail } = req.body;
    if (!email || !username || !newEmail)
        return next((0, createError_1.createError)(401, "Fill the forms!"));
    if (email !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email))
        return next((0, createError_1.createError)(404, "UNAUTHENTICATED !!!"));
    const findEmail = yield userModel_1.default.findOne({ email });
    if (!findEmail)
        return next((0, createError_1.createError)(401, "E-mail have not finded."));
    const newInfos = yield findEmail.updateOne({ username, email: newEmail });
    return res.status(200).json({ msg: newInfos });
}));
//VERIFY USER
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ status: true, user: req.user });
});
exports.verifyUser = verifyUser;
