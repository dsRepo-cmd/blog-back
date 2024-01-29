import * as fs from "fs";
import * as path from "path";
import { UserData } from "../User/index.js";
import { ArticleSortField, ArticleType } from "./consts.js";
import { fileURLToPath } from "url";
import { ArticleBlock, ArticleQueryParams } from "./types.js";

const dataFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "bd",
  "articles.json"
);

class Article {
  private static list: Article[];
  private static count: number = 1;

  public id: string;
  public title: string;
  public subtitle: string;
  public user: UserData;
  public img: string;
  public views: number;
  public createdAt: Date;
  public type: ArticleType;
  public blocks: ArticleBlock[];
  public isPublished: boolean;

  constructor(user: UserData) {
    this.id = Article.generateId();
    this.title = "";
    this.subtitle = "";
    this.user = user;
    this.img = "https://picsum.photos/650/400?random=1";
    this.views = 0;
    this.createdAt = new Date();
    this.type = ArticleType.ALL;
    this.blocks = [];
    this.isPublished = false;
  }

  //=====Save/Load==========================================BD
  private static loadData = (): Article[] => {
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

    const maxId = this.list.reduce((max, article) => {
      return Number(article.id) > max ? Number(article.id) : max;
    }, 0);

    this.count = maxId + 1;
  }
  //=========================================================

  public static getPublishedList(params: ArticleQueryParams): Article[] {
    let filteredArticles = [...this.list];
    console.log(params);

    if (params.isPublished) {
      const isPublishedFilterValue = params.isPublished === "true";
      filteredArticles = filteredArticles.filter(
        (article) => article.isPublished === isPublishedFilterValue
      );
    }

    //Filter By User
    if (params.userId) {
      console.log("params.userId", typeof params.userId);

      filteredArticles = filteredArticles.filter(
        (article) => article.user.id === params.userId
      );
    }

    // Apply filters
    if (params.type && params.type !== ArticleType.ALL) {
      filteredArticles = filteredArticles.filter(
        (article) => article.type === params.type
      );
    }

    if (params.q) {
      const searchRegex = new RegExp(params.q, "i");
      filteredArticles = filteredArticles.filter(
        (article) =>
          searchRegex.test(article.title) || searchRegex.test(article.subtitle)
      );
    }

    // Apply sorting
    let sortField: keyof Article = "createdAt";
    if (params._sort === ArticleSortField.VIEWS) {
      sortField = "views";
    } else if (params._sort === ArticleSortField.TITLE) {
      sortField = "title";
    }

    filteredArticles.sort((a, b) => {
      const aValue =
        typeof a[sortField] === "string"
          ? (a[sortField] as string)
          : String(a[sortField]);
      const bValue =
        typeof b[sortField] === "string"
          ? (b[sortField] as string)
          : String(b[sortField]);

      if (params._order === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    // Apply pagination
    const page =
      typeof params._page === "string"
        ? parseInt(params._page, 10)
        : params._page || 1;

    const limit =
      typeof params._limit === "string"
        ? parseInt(params._limit, 10)
        : params._limit || 4;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    console.log(paginatedArticles.map((article) => article.id));
    return paginatedArticles;
  }

  public static addArticle(article: Article): void {
    this.list.push(article);
    this.saveData();
  }

  public static getById(id: string): Article | null {
    const article = this.list.find((article) => article.id == id);
    if (article) {
      article.views += 1;
      this.saveData();
      return article;
    }
    return null;
  }

  public static deleteById(id: string): boolean {
    const index: number = this.list.findIndex((article) => article.id === id);

    if (index !== -1) {
      this.list.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  public static update(newArticle: Article): Article | null {
    const index: number = this.list.findIndex(
      (article) => article.id === newArticle.id
    );

    if (index !== -1) {
      this.list[index] = {
        ...this.list[index],
        ...newArticle,
      };
      this.saveData();
      return this.list[index];
    }
    console.log("Article not found with id:", newArticle.id);
    return null;
  }

  public static create(user: UserData): Article {
    const article: Article = new Article(user);
    Article.addArticle(article);
    return article;
  }
}

Article.initialize();

export { Article };
