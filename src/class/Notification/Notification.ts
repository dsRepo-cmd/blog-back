import mongoose, { Document, Schema } from "mongoose";
import { NotificationArgs, NotificationData } from "./types.js";
import { NotificationType } from "./consts.js";

const notificationSchema = new Schema({
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

interface NotificationModel extends Document {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  date: Date;
}

const NotificationModel = mongoose.model<NotificationModel>(
  "Notification",
  notificationSchema
);

class Notification {
  public static async initialize(): Promise<void> {}

  public static async getList(): Promise<NotificationData[]> {
    try {
      const notifications = await NotificationModel.find();
      return notifications.map((notification) => notification.toObject());
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  }

  public static async getByUserId(userId: string): Promise<NotificationData[]> {
    try {
      const notifications = await NotificationModel.find({ userId });
      return notifications.map((notification) => notification.toObject());
    } catch (error) {
      console.error("Error getting notifications by userId:", error);
      return [];
    }
  }

  public static async createNotification(
    data: NotificationArgs
  ): Promise<NotificationData> {
    try {
      const notification = await NotificationModel.create({
        userId: data.userId,
        type: data.type,

        message: data.message,
        href: data.href,
        date: new Date(),
      });

      return notification.toObject();
    } catch (error) {
      console.error("Error creating notification:", error);
      return {} as NotificationData;
    }
  }
}

export default Notification;
