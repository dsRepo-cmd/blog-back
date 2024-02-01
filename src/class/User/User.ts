import { Theme, UserRole } from "./consts.js";
import { IUserModel, JsonSettings, UserData } from "./types.js";
import UserModel from "./model.js";
import Profile from "../Profile/Profile.js";
import { EventEmitter } from "events";

class User extends EventEmitter {
  public static async create(data: {
    email: string;
    password: string;
  }): Promise<IUserModel> {
    const user = new UserModel({
      email: data.email.toLowerCase(),
      password: data.password,
      roles: [UserRole.USER],
      username: data.email.substring(0, data.email.indexOf("@")),
      avatar:
        "https://www.themoviedb.org/t/p/original/xzwtlufGF7SyW9qU5djqQICygo5.jpg",
      isConfirm: false,
      features: { isArticleRatingEnabled: true },
      jsonSettings: {
        theme: Theme.LIGHT,
        isFirstVisit: true,
        settingsPageHasBeenOpen: false,
        isArticlesPageWasOpened: false,
      },
    });

    const savedUser = await user.save();

    await Profile.create(savedUser);

    return savedUser;
  }

  public static async getById(id: string): Promise<IUserModel | null> {
    return (await UserModel.findOne({ id })) || null;
  }

  public static async getUserDataById(id: string): Promise<UserData | null> {
    const user = await UserModel.findOne({ id });

    if (user) {
      const userData: UserData = {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        roles: user.roles,
      };

      return userData;
    }

    return null;
  }

  public static async getByEmail(email: string): Promise<IUserModel | null> {
    return (await UserModel.findOne({ email: email.toLowerCase() })) || null;
  }

  public static async putJsonSettings(
    id: string,
    newJsonSettings: JsonSettings
  ): Promise<JsonSettings | null> {
    const user = await UserModel.findOne({ id });

    if (user) {
      user.jsonSettings = newJsonSettings;
      await user.save();

      return user.jsonSettings || null;
    }

    return null;
  }

  public static async putRoles(
    id: string,
    newRoles: UserRole[]
  ): Promise<UserRole[] | null> {
    const user = await UserModel.findOne({ id });

    if (user) {
      user.roles = newRoles;
      await user.save();

      return user.roles;
    }

    return null;
  }

  public static async confirmByEmail(
    email: string
  ): Promise<IUserModel | null> {
    const user = await UserModel.findOne({ email });

    if (user && !user.isConfirm) {
      user.isConfirm = true;
      await user.save();
    }

    return user || null;
  }

  public static updateUserByUserData = async (
    newUserData: UserData
  ): Promise<UserData | null> => {
    const user = await UserModel.findOneAndUpdate(
      { id: newUserData.id },
      {
        $set: {
          email: newUserData.email,
          username: newUserData.username,
          avatar: newUserData.avatar,
        },
      },
      { new: true }
    );

    return user ? newUserData : null;
  };

  public static async getUsersList(): Promise<IUserModel[]> {
    const usersList = await UserModel.find();
    return usersList;
  }

  public static async deleteById(userId: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ id: userId });
    console.log("deleteById===", result, userId);
    return result.deletedCount !== 0;
  }
}

export default User;
