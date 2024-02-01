import NotificationModel from "./model.js";
import { NotificationArgs, NotificationData } from "./types.js";

class Notification {
  public static async getList(): Promise<NotificationData[]> {
    try {
      const notifications = await NotificationModel.find().lean();
      return notifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  }

  public static async getByUserId(userId: string): Promise<NotificationData[]> {
    try {
      const notifications = await NotificationModel.find({ userId }).lean();
      return notifications;
    } catch (error) {
      console.error("Error getting notifications by userId:", error);
      throw error;
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
      throw error;
    }
  }
}

export default Notification;
