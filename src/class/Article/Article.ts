import mongoose, { Document, Schema, Model } from "mongoose";
import { UserData } from "../User/index.js";
import { ArticleBlockType, ArticleType } from "./consts.js";
import {
  ArticleBlock,
  ArticleCodeBlock,
  ArticleImageBlock,
  ArticleQueryParams,
  ArticleTextBlock,
} from "./types.js";

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

const codeBlockSchema = new Schema({
  id: String,
  type: String,
  code: String,
});

const imageBlockSchema = new Schema({
  id: String,
  type: String,
  src: String,
  title: String,
});

const textBlockSchema = new Schema({
  id: String,
  type: String,
  title: String,
  paragraphs: [String],
  paragraphIndex: Number,
});

const articleSchema = new Schema<ArticleModel>({
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
  blocks: [codeBlockSchema, imageBlockSchema, textBlockSchema],
  isPublished: Boolean,
});

const ArticleModel: Model<ArticleModel> = mongoose.model(
  "Article",
  articleSchema
);

class Article {
  public static async initialize(): Promise<void> {}

  public static async create(user: UserData): Promise<ArticleModel> {
    const article = new ArticleModel({
      title: "",
      subtitle: "",
      user,
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
    const { _limit, _page, _sort, _order, type, q, isPublished, userId } =
      params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (type) {
      query.type = type;
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { subtitle: { $regex: q, $options: "i" } },
      ];
    }

    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }

    if (userId) {
      query["user.id"] = userId;
    }

    let sortOrder: 1 | -1 = 1;

    if (_order && _order.toLowerCase() === "desc") {
      sortOrder = -1;
    }

    const sortField: Record<string, 1 | -1> = {};

    if (_sort) {
      sortField[_sort] = sortOrder;
    } else {
      sortField.createdAt = sortOrder;
    }

    try {
      const articles = await ArticleModel.find(query)
        .sort(sortField)
        .limit(_limit)
        .skip((_page - 1) * _limit)
        .exec();

      return articles || [];
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  }

  public static async getById(id: string): Promise<ArticleModel | null> {
    const article = await ArticleModel.findOne({ id });

    return article || null;
  }

  public static async deleteById(id: string): Promise<boolean> {
    const article = await ArticleModel.deleteOne({ id });

    return article.deletedCount !== undefined && article.deletedCount > 0;
  }

  public static async update(
    newArticle: ArticleModel
  ): Promise<ArticleModel | undefined> {
    try {
      console.log("newArticle++++++++++++", newArticle);

      const formattedBlocks = newArticle.blocks.map((block) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedBlock: Record<string, any> = {
          id: block.id,
          type: block.type,
        };

        if (block.type === ArticleBlockType.CODE) {
          formattedBlock.code = (block as ArticleCodeBlock).code;
        } else if (block.type === ArticleBlockType.IMAGE) {
          formattedBlock.src = (block as ArticleImageBlock).src;
        } else if (block.type === ArticleBlockType.TEXT) {
          const textBlock = block as ArticleTextBlock;
          formattedBlock.paragraphs = textBlock.paragraphs;
          formattedBlock.title = textBlock.title;
          formattedBlock.paragraphIndex = textBlock.paragraphIndex;
        }

        return formattedBlock;
      });

      const article = await ArticleModel.findOneAndUpdate(
        { id: newArticle.id },
        { ...newArticle, blocks: formattedBlocks },
        { new: true, runValidators: true }
      );

      console.log("Updated Article=========", newArticle);
      return article || undefined;
    } catch (error) {
      console.error("Error updating article:", error);
      return undefined;
    }
  }
}

export { Article };
