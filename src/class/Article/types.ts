import { User } from "../User/index.js";
import { ArticleBlockType, ArticleType } from "./consts.js";

export interface ArticleData {
  id: string;
  title: string;
  subtitle: string;
  user: User;
  img: string;
  views: number;
  createdAt: Date;
  type: ArticleType;
  blocks: ArticleBlock[];
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
  title?: string;
}

export interface ArticleTextBlock extends ArticleBlockBase {
  type: ArticleBlockType.TEXT;
  paragraphs: string[];
  title?: string;
  paragraphIndex?: number;
}

export type ArticleBlock =
  | ArticleCodeBlock
  | ArticleImageBlock
  | ArticleTextBlock;
