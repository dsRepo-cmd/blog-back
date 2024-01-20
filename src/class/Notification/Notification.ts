import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { NotificationArgs, NotificationData } from "./types.js";
import { NotificationType } from "./consts.js";

const dataFilePath = path.resolve(
  fileURLToPath(import.meta.url),
  "..\\..\\..\\bd\\notifications.json"
);

class Notification {
  private static list: NotificationData[];
  private static count: number;

  public id: string;
  public userId: string;
  public type: NotificationType;
  public title: string;
  public message: string;
  public href?: string;
  public date: Date;

  constructor({ userId, type, message, href }: NotificationArgs) {
    this.id = Notification.generateId();
    this.userId = userId;
    this.type = type;
    this.title = "";
    this.message = message;
    this.href = href;
    this.date = new Date();
  }

  //=====Save/Load==========================================BD

  private static loadData = (): Notification[] => {
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(data) || [];
    } catch (error) {
      return [];
    }
  };

  private static saveData = (): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(this.list, null, 2), "utf8");
  };

  private static generateId(): string {
    return (this.count++).toString();
  }

  public static initialize(): void {
    this.list = this.loadData();

    const maxId = this.list.reduce((max, notification) => {
      return Number(notification.id) > max ? Number(notification.id) : max;
    }, 0);

    this.count = maxId + 1;
  }

  //=========================================================

  public static getList(): NotificationData[] {
    return this.list;
  }

  public static addNotification(notification: NotificationData): void {
    this.list.push(notification);
    this.saveData();
  }

  public static getByUserId(userId: string): NotificationData[] {
    return this.list.filter((notification) => notification.userId === userId);
  }

  public static createNotification(data: NotificationArgs): NotificationData {
    console.log(data);
    const notification = new Notification(data);
    Notification.addNotification(notification);
    return notification;
  }
}

Notification.initialize();

export default Notification;
