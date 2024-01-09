import express, { Request, Response } from "express";

import { Article, ArticleQueryParams } from "../class/Article/index.js";
const router = express.Router();

// GET============================================================

router.get("/articles", function (req: Request, res: Response) {
  const query = req.query as unknown;

  if (!query) {
    return res.status(400).json({
      message: "Error. There are no query params",
    });
  }

  try {
    const articleQueryParams: ArticleQueryParams = query as ArticleQueryParams;

    const articles = Article.getPublishedList(articleQueryParams);

    return res.status(200).json(articles);
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

router.post("/articles/", function (req: Request, res: Response) {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      message: "Error. There are no query params",
    });
  }

  const articles = Article.getPublishedList(body);

  try {
    return res.status(200).json(articles);
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
