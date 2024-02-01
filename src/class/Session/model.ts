import { Model, Schema, model } from "mongoose";
import { ISessionModel } from "./types.js";

const sessionSchema = new Schema<ISessionModel>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const SessionModel: Model<ISessionModel> = model<ISessionModel>(
  "Session",
  sessionSchema
);

export default SessionModel;
