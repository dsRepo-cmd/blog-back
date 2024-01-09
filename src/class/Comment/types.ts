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
