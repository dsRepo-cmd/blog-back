import express, { Request, Response } from "express";
import Comment from "../class/Comment/Comment.js";
import { CommentArgs } from "../class/Comment/types.js";

const router = express.Router();

// GET============================================================

router.get("/comments", function (req: Request, res: Response) {
  const articleId = req.query.articleId as string;

  try {
    const comments = Comment.getByArticleId(articleId)?.reverse();

    return res.status(200).json(comments);
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

router.post("/comments", function (req: Request, res: Response) {
  const commentData = req.body as CommentArgs;

  try {
    const comment = Comment.create(commentData);
    console.log("POST", comment);
    return res.status(200).json(comment);
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
