export interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  href?: string;
  date: Date;
}
