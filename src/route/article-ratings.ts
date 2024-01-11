import { Router, Request, Response } from "express";
import ArticleRating from "../class/ArticleRating/ArticleRating.js";
import { RateArticleArg } from "../class/ArticleRating/types.js";
import { handleServerError } from "./index.js";

const router = Router();

router.get("/article-ratings", async (req: Request, res: Response) => {
  const articleId = req.query.articleId as string;

  if (!articleId) {
    return res.status(400).json({
      message: "articleId is required parameters",
    });
  }

  try {
    const rating = await ArticleRating.getByArticleId(articleId);

    if (rating) {
      return res.status(200).json(rating);
    } else {
      return res.status(404).json({
        message: "Rating not found",
      });
    }
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

router.post("/article-ratings", async (req: Request, res: Response) => {
  const args = req.body as RateArticleArg;

  if (!args || !args.userId || !args.articleId) {
    return res.status(400).json({
      message: "userId, articleId, and other required parameters are missing",
    });
  }

  try {
    await ArticleRating.create(args);
    return res.status(200).json();
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

export default router;
