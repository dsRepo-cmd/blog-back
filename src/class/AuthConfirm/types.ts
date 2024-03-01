import { Document } from "mongoose";

export interface AuthConfirmData {
  code: number;
  data: string;
}

export interface IAuthConfirmModel extends Document {
  code: number;
  data: string;
}
