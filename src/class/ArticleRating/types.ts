import { Document } from "mongoose";

export interface RateArticleArg {
  userId: string;
  articleId: string;
  rate: number;
  feedback: string;
}

export interface GetArticleRatingArg {
  userId: string;
  articleId: string;
}

export interface IArticleRatingModel extends Document {
  userId: string;
  articleId: string;
  feedback: string;
  rate?: number;
  date: Date;
}
