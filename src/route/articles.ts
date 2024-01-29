import express, { Request, Response } from "express";
import { Article, ArticleQueryParams } from "../class/Article/index.js";
import { handleServerError } from "./index.js";

const router = express.Router();

// GET ============================================================
router.get("/articles", async (req: Request, res: Response) => {
  const query = req.query as unknown;

  if (!query) {
    return res.status(400).json({
      message: "Error. There are no query params",
    });
  }

  try {
    const articleQueryParams: ArticleQueryParams = query as ArticleQueryParams;
    const articles = await Article.getPublishedList(articleQueryParams);

    return res.status(200).json(articles);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

// POST ===========================================================
router.post("/articles", async (req: Request, res: Response) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      message: "Error. There are no query params",
    });
  }

  try {
    const articles = await Article.getPublishedList(body);

    if (!articles || articles.length === 0) {
      return res.status(404).json({
        message: "No articles found",
      });
    }

    return res.status(200).json(articles);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

export default router;
