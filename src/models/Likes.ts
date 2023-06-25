import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Likes", likesSchema);
