"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "login required!"],
    },
    imageId: {
        type: String,
        required: [true, "image id required!"],
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
    },
    date: {
        type: Date,
        default: new Date(Date.now()),
    },
});
exports.default = mongoose_1.default.model("Comment", CommentSchema);
