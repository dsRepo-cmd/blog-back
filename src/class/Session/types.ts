import { Document, PopulatedDoc } from "mongoose";
import User from "../User/User.js";

export interface ISessionModel extends Document {
  token: string;
  user: PopulatedDoc<User & Document>;
}
