import mongoose, { Schema } from "mongoose";
import { NotificationData } from "./types.js";

const notificationSchema = new Schema<NotificationData>({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  userId: String,
  type: String,
  title: String,
  message: String,
  href: String,
  date: Date,
});

const NotificationModel = mongoose.model<NotificationData>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
