"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ImageSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Please provide a user id"],
        trim: true,
    },
    photoPath: {
        type: String,
        required: [true, "Please provide a image"],
        trim: true,
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "Please provide a location"],
        trim: true,
    },
    device: {
        type: String,
        required: [true, "Please provide a device"],
        trim: true,
    },
    desc: {
        type: String,
        required: [true, "Please provide a description"],
    },
    category: {
        type: String,
        required: [true, "Please provide a category"],
        trim: true,
    },
    tags: [String],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Images", ImageSchema);
