import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Theme, UserRole } from "./consts.js";
import { FeatureFlags, JsonSettings, UserData } from "./types.js";
import { Profile } from "../Profile/index.js";

const dataFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "bd",
  "users.json"
);

class User {
  private static list: User[] = [];
  private static count: number = 1;

  public id: string;
  public email: string;
  public username?: string;
  public avatar?: string;
  public roles?: UserRole[];
  public isConfirm?: boolean;
  public features?: FeatureFlags;
  public jsonSettings?: JsonSettings;
  public password: string;

  constructor({ email, password }: { email: string; password: string }) {
    this.id = User.generateId();
    this.roles = [UserRole.USER];
    this.avatar =
      "https://www.themoviedb.org/t/p/original/xzwtlufGF7SyW9qU5djqQICygo5.jpg";
    this.email = email.toLowerCase();
    this.password = password;
    this.isConfirm = false;

    const atIndex = email.indexOf("@");
    this.username = atIndex !== -1 ? email.substring(0, atIndex) : email;

    this.features = { isArticleRatingEnabled: true };

    this.jsonSettings = {
      theme: Theme.LIGHT,
      isFirstVisit: true,
      settingsPageHasBeenOpen: false,
      isArticlesPageWasOpened: false,
    };
  }

  //=====Save/Load==========================================BD

  private static loadData = (): User[] => {
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

    const maxId = this.list.reduce((max, user) => {
      return Number(user.id) > max ? Number(user.id) : max;
    }, 0);

    this.count = maxId + 1;
  }

  //=========================================================

  public static create = (data: { email: string; password: string }): User => {
    const user = new User(data);

    this.list.push(user);
    this.saveData();

    const userData = User.getUserDataById(user.id);
    if (userData) Profile.create(userData);

    return user;
  };

  public static getById = (id: string): User | undefined => {
    return this.list.find((user) => user.id === id);
  };

  public static getUserDataById = (id: string): UserData | undefined => {
    const user = this.getById(id);

    if (user) {
      const userData: UserData = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        roles: user.roles,
      };

      return userData;
    }

    return undefined;
  };

  public static getByEmail = (email: string): User | false => {
    return (
      this.list.find((user) => user.email === email.toLowerCase()) || false
    );
  };

  public static putJsonSettings = (
    id: string,
    newJsonSettings: JsonSettings
  ): JsonSettings | false => {
    const user = this.getById(id);

    if (user) {
      user.jsonSettings = newJsonSettings;
      this.saveData();

      const savedJsonSettings = user.jsonSettings;
      if (savedJsonSettings) {
        return savedJsonSettings;
      }
    }

    return false;
  };

  public static putRoles = (
    id: string,
    newRoles: UserRole[]
  ): UserRole[] | false => {
    const user = this.getById(id);

    if (user) {
      user.roles = newRoles;
      this.saveData();

      const savedRoles = user.roles;
      if (savedRoles) {
        return savedRoles;
      }
    }

    return false;
  };

  public static confirmByEmail = (email: string): User | false => {
    const user = this.getByEmail(email);

    if (user) {
      user.isConfirm = true;
      this.saveData();
    }

    return user || false;
  };

  public static updateUserByUserData(newUserData: UserData): UserData | null {
    const userIndex = this.list.findIndex((user) => user.id === newUserData.id);

    if (userIndex !== -1) {
      const updatedUser = this.list[userIndex];

      if (newUserData.email !== undefined) {
        updatedUser.email = newUserData.email;
      }

      if (newUserData.username !== undefined) {
        updatedUser.username = newUserData.username;
      }

      if (newUserData.avatar !== undefined) {
        updatedUser.avatar = newUserData.avatar;
      }

      if (newUserData.roles !== undefined) {
        updatedUser.roles = newUserData.roles;
      }

      this.list[userIndex] = updatedUser;
      this.saveData();

      return updatedUser;
    }

    return null;
  }
  public static getUsersList() {
    return this.list;
  }

  public static deletebyId(userId: string): boolean {
    const index = this.list.findIndex((user) => user.id === userId);

    if (index !== -1) {
      this.list.splice(index, 1);
      this.saveData();
      return true;
    }

    return false;
  }
}

User.initialize();

export default User;
