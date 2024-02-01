import { Document } from "mongoose";
import { UserData } from "../User/index.js";
import { ArticleBlockType, ArticleType } from "./consts.js";

export interface ArticleData extends Document {
  id: string;
  title: string;
  subtitle: string;
  user: UserData;
  img: string;
  views: number;
  createdAt: Date;
  type: ArticleType;
  blocks: ArticleBlock[];
  isPublished: boolean;
}

export type SortOrder = "asc" | "desc";

export interface ArticleQueryParams {
  _expand: string;
  _limit: number;
  _page: number;
  _sort: string;
  _order: string;
  type: ArticleType;
  q: string;
  isPublished: boolean | string;
  userId: string;
}

export interface ArticleBlockBase {
  id: string;
  type: ArticleBlockType;
}

export interface ArticleCodeBlock extends ArticleBlockBase {
  type: ArticleBlockType.CODE;
  code: string;
}

export interface ArticleImageBlock extends ArticleBlockBase {
  type: ArticleBlockType.IMAGE;
  src: string;
  title: string;
}

export interface ArticleTextBlock extends ArticleBlockBase {
  type: ArticleBlockType.TEXT;
  paragraph: string;
  title: string;
}

export type ArticleBlock =
  | ArticleImageBlock
  | ArticleCodeBlock
  | ArticleTextBlock;
