import mongoose, { Document, Schema } from "mongoose";
import { Country, Currency } from "./consts.js";
import { IUserModel, UserData } from "../User/types.js";
import User from "../User/User.js";

const profileSchema = new Schema({
  id: String,
  first: String,
  lastname: String,
  age: Number,
  currency: String,
  country: String,

  user: {
    id: String,
    email: String,
    username: String,
    avatar: String,
    roles: [String],
  },
});

interface ProfileModel extends Document {
  id: string;
  first?: string;
  lastname?: string;
  age?: number;
  currency?: Currency;
  country?: Country;
  user: UserData;
}

const ProfileModel = mongoose.model<ProfileModel>("Profile", profileSchema);

class Profile {
  public static async initialize(): Promise<void> {}

  public static async create(user: IUserModel): Promise<ProfileModel> {
    const profile = new ProfileModel({
      id: user.id,
      first: "",
      lastname: "",
      age: 0,
      currency: Currency.USD,
      country: Country.USA,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        roles: user.roles,
      },
    });

    return await profile.save();
  }

  public static async getById(id: string): Promise<ProfileModel | null> {
    const profile = await ProfileModel.findOne({ id });

    return profile || null;
  }

  public static async update(
    newProfile: Promise<ProfileModel>
  ): Promise<ProfileModel | null> {
    try {
      const resolvedNewProfile = await newProfile;

      console.log("newProfile", resolvedNewProfile);

      const existingProfile = await ProfileModel.findOne({
        id: resolvedNewProfile.id,
      });

      if (existingProfile) {
        existingProfile.first =
          resolvedNewProfile.first || existingProfile.first;
        existingProfile.lastname =
          resolvedNewProfile.lastname || existingProfile.lastname;
        existingProfile.age = resolvedNewProfile.age || existingProfile.age;
        existingProfile.currency =
          resolvedNewProfile.currency || existingProfile.currency;
        existingProfile.country =
          resolvedNewProfile.country || existingProfile.country;

        existingProfile.user = existingProfile.user = {
          ...resolvedNewProfile.user,
          ...existingProfile.user,
        };

        await existingProfile.save();

        await User.updateUserByUserData(resolvedNewProfile.user);

        return existingProfile;
      } else {
        console.error("Profile not found by ID:", resolvedNewProfile.id);
        return null;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  }
}

Profile.initialize();

export default Profile;
