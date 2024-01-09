import express, { Request, Response } from "express";

import { Article } from "../class/Article/index.js";
import User from "../class/User/User.js";
const router = express.Router();

// PUT=============================================================

router.put("/article/:id", function (req: Request, res: Response) {
  const updatedArticle = req.body;

  try {
    const savedArticle = Article.update(updatedArticle);

    return res.status(200).json(savedArticle);
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

// GET============================================================

router.get("/article/:id", function (req: Request, res: Response) {
  const id = req.params.id;

  try {
    const article = Article.getById(id);

    return res.status(200).json(article);
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

// DELETE===========================================================

router.delete("/article/:id", function (req: Request, res: Response) {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "ID is not defined",
    });
  }
  try {
    const article = Article.deleteById(id);

    if (!article)
      return res.status(400).json({
        message: `Article not found with id: ${id}`,
      });

    return res.status(200).json(article);
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

// POST=============================================================

router.post("/article", function (req: Request, res: Response) {
  const { userId } = req.body;

  try {
    const user = User.getUserDataById(userId);

    if (!user) {
      return res.status(400).json();
    }
    const savedArticle = Article.create(user);

    return res.status(200).json(savedArticle);
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
