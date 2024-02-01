import { model } from "mongoose";
import { Schema } from "mongoose";
import { Model } from "mongoose";
import { IArticleRatingModel } from "./types.js";

const articleRatingSchema = new Schema<IArticleRatingModel>({
  userId: {
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  rate: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const ArticleRatingModel: Model<IArticleRatingModel> =
  model<IArticleRatingModel>("ArticleRating", articleRatingSchema);

export default ArticleRatingModel;
