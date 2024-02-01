import ArticleRatingModel from "./model.js";
import {
  RateArticleArg,
  GetArticleRatingArg,
  IArticleRatingModel,
} from "./types.js";

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
