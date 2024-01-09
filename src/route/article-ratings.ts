import express, { Request, Response } from "express";
import ArticleRating from "../class/ArticleRating/ArticleRating.js";
import { RateArticleArg } from "../class/ArticleRating/types.js";

const router = express.Router();

// GET============================================================

router.get("/article-ratings", function (req: Request, res: Response) {
  const userId = req.query.userId as string;
  const articleId = req.query.articleId as string;

  try {
    const rating = ArticleRating.getByIds({ userId, articleId });
    console.log("RATIONG", rating);
    return res.status(200).json(rating);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
});

// POST===========================================================

router.post("/article-ratings", function (req: Request, res: Response) {
  const args = req.body as RateArticleArg;

  try {
    ArticleRating.create(args);

    return res.status(200).json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
});

export default router;
