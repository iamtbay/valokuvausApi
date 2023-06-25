"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const likesSchema = new mongoose_1.default.Schema({
    userId: {
        required: true,
        trim: true,
        type: String,
    },
    imageId: {
        required: true,
        trim: true,
        type: String,
        $ref: "imagemodels",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Likes", likesSchema);
