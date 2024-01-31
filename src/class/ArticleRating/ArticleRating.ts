import { Document, Schema, model, Model } from "mongoose";
import { RateArticleArg, GetArticleRatingArg } from "./types.js";

interface IArticleRatingModel extends Document {
  userId: string;
  articleId: string;
  feedback: string;
  rate?: number;
  date: Date;
}

const articleRatingSchema = new Schema({
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

class ArticleRating {
  public static async create(
    data: RateArticleArg
  ): Promise<IArticleRatingModel> {
    const articleRating = new ArticleRatingModel(data);
    await articleRating.save();
    return articleRating;
  }

  public static async getByIds({
    userId,
    articleId,
  }: GetArticleRatingArg): Promise<IArticleRatingModel[] | null> {
    const result = await ArticleRatingModel.find({ userId, articleId }).exec();
    return result;
  }

  public static async getByArticleId(
    articleId: string
  ): Promise<IArticleRatingModel[] | null> {
    const result = await ArticleRatingModel.find({ articleId }).exec();
    return result;
  }
}

export default ArticleRating;
