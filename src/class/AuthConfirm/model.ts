import mongoose, { Model, Schema } from "mongoose";
import { IAuthConfirmModel } from "./types.js";

const authConfirmSchema = new Schema<IAuthConfirmModel>({
  code: {
    type: Number,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const AuthConfirmModel: Model<IAuthConfirmModel> =
  mongoose.model<IAuthConfirmModel>("AuthConfirm", authConfirmSchema);
export default AuthConfirmModel;
