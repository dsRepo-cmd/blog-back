import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
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

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
