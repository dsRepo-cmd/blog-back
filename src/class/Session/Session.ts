import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { User } from "../User/index.js";

const dataFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "bd",
  "sessions.json"
);

interface SessionData {
  token: string;
  user: User;
}

class Session {
  private static list: SessionData[];

  public token: string;
  public user: User;

  constructor(user: User) {
    this.token = Session.generateCode();
    this.user = user;
  }

  //=====Save/Load==========================================BD

  private static loadData = (): SessionData[] => {
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };

  private static saveData = (data: SessionData[]): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  };

  public static initialize(): void {
    Session.list = Session.loadData();
  }

  //=========================================================

  public static getList(): SessionData[] {
    return Session.list;
  }

  public static addSession(session: SessionData): void {
    Session.list.push(session);
    Session.saveData(Session.list);
  }

  public static findSessionByToken(token: string): SessionData | undefined {
    return Session.list.find((item) => item.token === token);
  }

  public static generateCode(): string {
    const length = 12;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const generateCharacter = () =>
      characters[Math.floor(Math.random() * characters.length)];

    const token = Array.from({ length }, generateCharacter).join("");

    return token;
  }

  public static create(data: User): Session {
    const session = new Session(data);
    Session.addSession(session);
    return session;
  }
}

Session.initialize();

export default Session;
