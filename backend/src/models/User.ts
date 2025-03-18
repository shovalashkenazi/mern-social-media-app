import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // ✅ Unique Email Identifier
    username: { type: String, required: true },
    password: { type: String }, // ✅ Not required for OAuth users
    profileImage: { type: String, default: "" }, // ✅ Profile Picture
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    }, // ✅ Track Auth Method
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
