import { NotificationType } from "./consts.js";

export interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  href?: string;
  date: Date;
}

export interface NotificationArgs {
  userId: string;
  type: NotificationType;
  message: string;
  href?: string;
}
