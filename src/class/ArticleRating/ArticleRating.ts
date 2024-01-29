import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { GetArticleRatingArg, RateArticleArg } from "./types.js";

const dataFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "bd",
  "articleRatings.json"
);

class ArticleRating {
  private static list: ArticleRating[];
  private static count: number = 1;

  public id: string;
  public userId: string;
  public articleId: string;
  public feedback: string;
  public rate?: number;
  public date: Date;

  constructor({ userId, articleId, rate, feedback }: RateArticleArg) {
    this.id = ArticleRating.generateId();
    this.userId = userId;
    this.articleId = articleId;
    this.feedback = feedback;
    this.rate = rate;
    this.date = new Date();
  }

  //=====Save/Load==========================================BD
  private static loadData = (): ArticleRating[] => {
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(data) || [];
    } catch (error) {
      return [];
    }
  };

  private static saveData = (): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(this.list, null, 2), "utf8");
  };

  private static generateId(): string {
    return (this.count++).toString();
  }

  public static initialize(): void {
    this.list = this.loadData();

    const maxId = this.list.reduce((max, articleRating) => {
      return Number(articleRating.id) > max ? Number(articleRating.id) : max;
    }, 0);

    this.count = maxId + 1;
  }
  //=========================================================

  public static add(data: ArticleRating): void {
    this.list.push(data);
    this.saveData();
  }

  public static create(data: RateArticleArg): ArticleRating {
    const profile = new ArticleRating(data);

    ArticleRating.add(profile);
    return profile;
  }

  public static getList(): ArticleRating[] {
    return this.list;
  }

  public static getByIds({
    userId,
    articleId,
  }: GetArticleRatingArg): ArticleRating[] | null {
    const result = this.list.filter(
      (rating) => rating.userId === userId && rating.articleId === articleId
    );
    if (result) {
      return result;
    }
    return null;
  }
  public static getByArticleId(articleId: string): ArticleRating[] | null {
    const result = this.list.filter((rating) => rating.articleId === articleId);
    if (result) {
      return result;
    }
    return null;
  }
}

ArticleRating.initialize();

export default ArticleRating;
