import { Document } from "mongoose";
import { Theme, UserRole } from "./consts.js";
export interface UserData {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  roles?: UserRole[];
}

export interface FeatureFlags {
  isArticleRatingEnabled?: boolean;
  isCounterEnabled?: boolean;
  isAppRedesigned?: boolean;
}

export interface JsonSettings {
  theme?: Theme;
  isFirstVisit?: boolean;
  settingsPageHasBeenOpen?: boolean;
  isArticlesPageWasOpened?: boolean;
}

export interface IUserModel extends Document {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  roles?: UserRole[];
  isConfirm?: boolean;
  features?: FeatureFlags;
  jsonSettings?: JsonSettings;
  password: string;
}
