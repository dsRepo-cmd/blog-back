import { UserData } from "../User/types.js";
import { Country, Currency } from "./consts.js";

export interface ProfileData {
  id: string;
  first?: string;
  lastname?: string;
  age?: number;
  currency?: Currency;
  country?: Country;
  user?: UserData;
}
