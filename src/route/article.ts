import express, { Request, Response } from "express";
import { Article } from "../class/Article/index.js";
import User from "../class/User/User.js";
import { handleServerError } from "./index.js";
import Notification from "../class/Notification/Notification.js";
import { NotificationType } from "../class/Notification/consts.js";

const router = express.Router();

router.put("/article/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedArticle = req.body;

  if (!id || !updatedArticle) {
    return res.status(400).json({
      message: "ID and updatedArticle are required parameters",
    });
  }

  try {
    const savedArticle = await Article.update(updatedArticle);
    return res.status(200).json(savedArticle);
  } catch (error) {
    return handleServerError(res, error);
  }
});

router.get("/article/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      message: "ID is required",
    });
  }

  try {
    const article = await Article.getById(id);
    if (!article) {
      return res.status(404).json({
        message: `Article not found with id: ${id}`,
      });
    }

    return res.status(200).json(article);
  } catch (error) {
    return handleServerError(res, error);
  }
});

router.delete("/article/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      message: "ID is required",
    });
  }

  try {
    const article = await Article.deleteById(id);

    if (!article) {
      return res.status(404).json({
        message: `Article not found with id: ${id}`,
      });
    }

    return res.status(200).json(article);
  } catch (error) {
    return handleServerError(res, error);
  }
});

router.post("/article", async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "userId is required",
    });
  }

  try {
    const user = await User.getUserDataById(userId);

    if (!user) {
      return res.status(404).json({
        message: `User not found with id: ${userId}`,
      });
    }

    const savedArticle = await Article.create(user);
    console.log("savedArticle", savedArticle.id);

    await Notification.createNotification({
      userId: userId,
      type: NotificationType.ANNOUNCEMENT,
      message: "An article was created",
      href: `article/${savedArticle.id}`,
    });

    return res.status(200).json(savedArticle);
  } catch (error) {
    return handleServerError(res, error);
  }
});

export default router;
