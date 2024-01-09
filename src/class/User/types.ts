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
