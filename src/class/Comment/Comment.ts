import * as fs from "fs";
import * as path from "path";

import { fileURLToPath } from "url";
import { CommentArgs, CommentData } from "./types.js";
import User from "../User/User.js";

const dataFilePath = path.resolve(
  fileURLToPath(import.meta.url),
  "..\\..\\..\\bd\\comment.json"
);

class Comment {
  private static list: Comment[];
  private static count: number = 1;

  public id: string;
  public text: string;
  public articleId: string;
  public userId: string;

  // Csonstructor=========================================================

  constructor(data: CommentArgs) {
    this.id = Comment.generateId();
    this.articleId = data.articleId;
    this.userId = data.userId;
    this.text = data.text;
  }

  //=====Save/Load==========================================BD
  private static loadData = (): Comment[] => {
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

    const maxId = this.list.reduce((max, comment) => {
      return Number(comment.id) > max ? Number(comment.id) : max;
    }, 0);

    this.count = maxId + 1;
  }

  //=========================================================
  public static create(data: CommentArgs): Comment {
    const comment = new Comment(data);

    Comment.add(comment);
    return comment;
  }

  private static add(data: Comment): void {
    this.list.push(data);
    this.saveData();
  }

  public static getByArticleId(articleId: string): CommentData[] | [] {
    const comments = this.list
      .filter((comment) => comment.articleId === articleId)
      .map((comment) => {
        const user = User.getUserDataById(comment.userId);

        if (user) {
          return {
            id: comment.id,
            user,
            text: comment.text,
            articleId: comment.articleId,
            userId: comment.userId,
          } as CommentData;
        }

        return {};
      });

    console.log(comments);
    if (comments.length === 0) {
      return [];
    }

    return comments as CommentData[];
  }
}

Comment.initialize();

export default Comment;
