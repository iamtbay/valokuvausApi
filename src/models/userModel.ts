import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//TYPES

interface IUser {
  username: string;
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => boolean;
  createJWT: () => {};
}

//SCHEMA
const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    min: 4,
  },
  email: {
    type: String,
    required: [true, "Please enter a email"],
    min: 4,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    min: 4,
  },
});

//Hash password
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//check password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
export default mongoose.model("User", UserSchema);
