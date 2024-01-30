import mongoose, { Document, Schema } from "mongoose";
import { UserData } from "../User/index.js";
import { ArticleSortField, ArticleType } from "./consts.js";
import { ArticleBlock, ArticleQueryParams } from "./types.js";

const articleSchema = new Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  title: String,
  subtitle: String,
  user: {
    id: String,
    email: String,
    username: String,
    avatar: String,
    roles: [String],
  },
  img: String,
  views: Number,
  createdAt: Date,
  type: String,
  blocks: [
    {
      id: String,
      type: String,
      src: String,
      title: String,
      paragraphs: [String],
      paragraphIndex: Number,
    },
  ],
  isPublished: Boolean,
});

interface ArticleModel extends Document {
  id: string;
  title: string;
  subtitle: string;
  user: UserData;
  img: string;
  views: number;
  createdAt: Date;
  type: string;
  blocks: ArticleBlock[];
  isPublished: boolean;
}

const ArticleModel = mongoose.model<ArticleModel>("Article", articleSchema);

class Article {
  public static async initialize(): Promise<void> {}

  public static async create(user: UserData): Promise<ArticleModel> {
    const article = new ArticleModel({
      title: "",
      subtitle: "",
      user: user,
      img: "https://picsum.photos/650/400?random=1",
      views: 0,
      createdAt: new Date(),
      type: ArticleType.ALL,
      blocks: [],
      isPublished: false,
    });

    return await article.save();
  }

  public static async getPublishedList(
    params: ArticleQueryParams
  ): Promise<ArticleModel[]> {
    try {
      let filteredArticles = await ArticleModel.find({});

      if (params.isPublished) {
        const isPublishedFilterValue = params.isPublished === "true";
        filteredArticles = filteredArticles.filter(
          (article) => article.isPublished === isPublishedFilterValue
        );
      }

      if (params.userId) {
        filteredArticles = filteredArticles.filter(
          (article) => article.user.id === params.userId
        );
      }

      if (params.type && params.type !== ArticleType.ALL) {
        filteredArticles = filteredArticles.filter(
          (article) => article.type === params.type
        );
      }

      if (params.q) {
        const searchRegex = new RegExp(params.q, "i");
        filteredArticles = filteredArticles.filter(
          (article) =>
            searchRegex.test(article.title) ||
            searchRegex.test(article.subtitle)
        );
      }

      let sortField: keyof ArticleModel = "createdAt";
      if (params._sort === ArticleSortField.VIEWS) {
        sortField = "views";
      } else if (params._sort === ArticleSortField.TITLE) {
        sortField = "title";
      }

      const sortOrder = params._order === "asc" ? 1 : -1;

      const paginatedArticles = await ArticleModel.find(filteredArticles)
        .sort({ [sortField]: sortOrder })
        .skip(
          (parseInt(params._page.toString(), 10) || 1 - 1) *
            (parseInt(params._limit.toString(), 10) || 4)
        )
        .limit(parseInt(params._limit.toString(), 10) || 4);

      return paginatedArticles;
    } catch (error) {
      console.error("Error fetching articles from MongoDB:", error);
      return [];
    }
  }

  public static async getById(id: string): Promise<ArticleModel | null> {
    const article = await ArticleModel.findOne({ id });

    return article || null;
  }

  public static async deleteById(id: string): Promise<boolean> {
    const article = await ArticleModel.deleteOne({ id });

    if (article) {
      return true;
    }
    return false;
  }

  public static async update(
    newArticle: ArticleModel
  ): Promise<ArticleModel | undefined> {
    try {
      const article = await ArticleModel.findOneAndUpdate(
        { id: newArticle.id },
        { ...newArticle }
      );
      console.log("newArticle=========", newArticle);
      return article || undefined;
    } catch (error) {
      console.log(error);
    }
  }
}

export { Article };
