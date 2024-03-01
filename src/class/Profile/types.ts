import { Document } from "mongoose";
import { UserData } from "../User/types.js";
import { Country, Currency } from "./consts.js";

export interface ProfileData extends Document {
  id: string;
  first?: string;
  lastname?: string;
  age?: number;
  currency?: Currency;
  country?: Country;
  user: UserData;
}
