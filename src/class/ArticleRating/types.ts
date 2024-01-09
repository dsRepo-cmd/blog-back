export interface RateArticleArg {
  userId: string;
  articleId: string;
  rate: number;
  feedback: string;
}

export interface GetArticleRatingArg {
  userId: string;
  articleId: string;
}
