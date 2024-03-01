import mongoose, { Schema } from "mongoose";

import { IUserModel } from "./types.js";

const userSchema = new Schema<IUserModel>({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  email: {
    type: String,
    required: true,
  },
  username: String,
  avatar: String,
  roles: [String],
  isConfirm: Boolean,
  features: {
    isArticleRatingEnabled: Boolean,
  },
  jsonSettings: {
    theme: String,
    isFirstVisit: Boolean,
    settingsPageHasBeenOpen: Boolean,
    isArticlesPageWasOpened: Boolean,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model<IUserModel>("User", userSchema);

export default UserModel;
