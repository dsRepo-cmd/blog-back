import { UserData } from "../User/index.js";
import { ArticleType } from "./consts.js";
import ArticleModel from "./model.js";
import { ArticleData, ArticleQueryParams } from "./types.js";

class Article {
  public static create(user: UserData): Promise<ArticleData> {
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

    return article.save();
  }

  public static async getPublishedList(
    params: ArticleQueryParams
  ): Promise<ArticleData[]> {
    const { _limit, _page, _sort, _order, type, q, isPublished } = params;

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

  public static async getById(id: string): Promise<ArticleData | null> {
    const article = await ArticleModel.findOne({ id });

    return article || null;
  }

  public static async deleteById(id: string): Promise<boolean> {
    const article = await ArticleModel.deleteOne({ id });

    return article.deletedCount !== undefined && article.deletedCount > 0;
  }

  public static async update(
    newArticle: ArticleData
  ): Promise<ArticleData | undefined> {
    try {
      const article = await ArticleModel.findOneAndUpdate(
        { id: newArticle.id },
        Object.assign({}, newArticle),
        { new: true, upsert: true }
      );

      return article || undefined;
    } catch (error) {
      console.error("Error updating article:", error);
      return undefined;
    }
  }
}

export { Article };
