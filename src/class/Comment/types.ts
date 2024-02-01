import { Document } from "mongoose";
import { UserData } from "../User/types.js";

export interface CommentArgs {
  userId: string;
  text: string;
  articleId: string;
}

export interface CommentData {
  id: string;
  user: UserData;
  text: string;
  articleId: string;
  userId: string;
}

export interface ICommentModel extends Document {
  articleId: string;
  userId: string;
  text: string;
}
