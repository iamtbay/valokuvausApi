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
exports.AuthUser = void 0;
const createError_1 = require("../errorHandler/createError");
const Comments_1 = __importDefault(require("../models/Comments"));
//CHECK USER IS AUTHENTICATE TO DO ANYTHING OR NOT
const AuthUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    console.log(id);
    try {
        const findImg = yield Comments_1.default.findOne({ _id: id });
        if ((findImg === null || findImg === void 0 ? void 0 : findImg.userId.toString()) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId))
            return next((0, createError_1.createError)(404, "Unauthorized user!"));
        next();
    }
    catch (error) {
        next((0, createError_1.createError)(401, "Unauthorized user!"));
    }
});
exports.AuthUser = AuthUser;
