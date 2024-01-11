import express, { Request, Response } from "express";
import Comment from "../class/Comment/Comment.js";
import { CommentArgs } from "../class/Comment/types.js";
import { handleServerError } from "./index.js";

const router = express.Router();

// GET ============================================================
router.get("/comments", async (req: Request, res: Response) => {
  const articleId = req.query.articleId as string;

  if (!articleId) {
    return res.status(400).json({
      message: "Error. 'articleId' is required in query params",
    });
  }

  try {
    const comments = await Comment.getByArticleId(articleId);

    if (!comments) {
      return res.status(404).json({
        message: "No comments found for the specified articleId",
      });
    }

    return res.status(200).json(comments.reverse());
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

// POST ===========================================================
router.post("/comments", async (req: Request, res: Response) => {
  const commentData = req.body as CommentArgs;

  if (!commentData || !commentData.articleId) {
    return res.status(400).json({
      message: "Error. 'articleId' is required in commentData",
    });
  }

  try {
    const comment = await Comment.create(commentData);

    if (!comment) {
      return res.status(404).json({
        message: "Failed to create comment",
      });
    }

    return res.status(200).json(comment);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

export default router;
