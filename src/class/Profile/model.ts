import mongoose, { Schema } from "mongoose";
import { ProfileData } from "./types.js";

const profileSchema = new Schema<ProfileData>({
  id: String,
  first: String,
  lastname: String,
  age: Number,
  currency: String,
  country: String,

  user: {
    id: String,
    email: String,
    username: String,
    avatar: String,
    roles: [String],
  },
});

const ProfileModel = mongoose.model<ProfileData>("Profile", profileSchema);

export default ProfileModel;
