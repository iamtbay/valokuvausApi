import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Images", ImageSchema);
