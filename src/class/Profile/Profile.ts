import { Country, Currency } from "./consts.js";
import { IUserModel } from "../User/types.js";
import User from "../User/User.js";
import ProfileModel from "./model.js";
import { ProfileData } from "./types.js";

class Profile {
  public static async create(user: IUserModel): Promise<ProfileData> {
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

    return profile.save();
  }

  public static async getById(id: string): Promise<ProfileData | null> {
    const profile = await ProfileModel.findOne({ id });

    return profile || null;
  }

  public static update = async (
    newProfile: ProfileData
  ): Promise<ProfileData | null> => {
    try {
      const existingProfile = await ProfileModel.findOne({ id: newProfile.id });

      if (existingProfile) {
        Object.assign(existingProfile, newProfile);

        await existingProfile.save();

        await User.updateUserByUserData(newProfile.user);

        return existingProfile;
      } else {
        console.error("Profile not found by ID:", newProfile.id);
        return null;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
}

export default Profile;
