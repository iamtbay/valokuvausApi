import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
export default mongoose.model("Comment", CommentSchema);
