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
exports.AuthenticateUser = void 0;
const createError_1 = require("../errorHandler/createError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//INTERFACE
//CHECK USER LOGGED IN OR NOT IF USER EXIST GET REQ.USER WITH USER'S INFOS
//FUNCTION
const AuthenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentToken = req.cookies.accessToken;
    if (!currentToken)
        return next((0, createError_1.createError)(404, "Have to login!"));
    try {
        const payload = jsonwebtoken_1.default.verify(currentToken, process.env.JWT_SECRET);
        if (!payload) {
            return next((0, createError_1.createError)(404, "Unauthenticated!"));
        }
        req.user = {
            username: payload.username,
            userId: payload.userId,
            email: payload.email,
        };
        next();
    }
    catch (error) {
        next((0, createError_1.createError)(401, "Authentication invalid!"));
    }
});
exports.AuthenticateUser = AuthenticateUser;
