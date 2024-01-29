import * as fs from "fs";
import * as path from "path";
import { Country, Currency } from "./consts.js";
import { ProfileData } from "./types.js";
import { fileURLToPath } from "url";
import { UserData } from "../User/types.js";
import User from "../User/User.js";

const dataFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),

  "..",
  "..",
  "bd",
  "profiles.json"
);

class Profile {
  private static list: Profile[] = [];

  public id: string;
  public first?: string;
  public lastname?: string;
  public age?: number;
  public currency?: Currency;
  public country?: Country;
  public user: UserData;

  constructor(user: UserData) {
    this.id = user.id;
    this.user = user;
    this.first = "";
    this.lastname = "";
    this.age = 0;
    this.country = Country.USA;
    this.currency = Currency.EUR;
  }

  //=====Save/Load==========================================BD
  private static loadData = (): Profile[] => {
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

  public static initialize(): void {
    this.list = this.loadData();
  }
  //=========================================================

  public static create(userData: UserData): Profile {
    const profile = new Profile(userData);

    Profile.addProfile(profile);
    return profile;
  }

  public static getList(): Profile[] {
    return this.list;
  }

  public static addProfile(profile: Profile): Profile | null {
    this.list.push(profile);
    this.saveData();
    return profile;
  }

  public static getById(id: string): Profile | null {
    return this.list.find((profile) => profile.id === id) || null;
  }

  public static update(newProfile: ProfileData): Profile | null {
    const index = this.list.findIndex(
      (profile) => profile.id === newProfile.id
    );

    if (index !== -1) {
      const updatedProfile: Profile = {
        ...this.list[index],
        ...newProfile,
        user: {
          ...this.list[index].user,
          ...newProfile.user,
          id: newProfile.user?.id || this.list[index].user?.id,
        },
      };

      this.list[index] = updatedProfile;
      this.saveData();

      if (newProfile.id && newProfile.user) {
        User.updateUserByUserData({
          id: updatedProfile.user?.id,
          email: newProfile.user.email,
          username: newProfile.user.username,
          avatar: newProfile.user.avatar,
          roles: newProfile.user.roles,
        });
      }

      return updatedProfile;
    }
    console.error("Profile not found by ID:", newProfile.id);
    return null;
  }
}

Profile.initialize();

export default Profile;
