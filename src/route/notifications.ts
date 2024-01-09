import express, { Request, Response } from "express";
import { User } from "../class/User/index.js";
import { Notification } from "../class/Notification/index.js";
const router = express.Router();

router.get("/notifications/:userId", function (req: Request, res: Response) {
  const userId = req.params.userId;
  const head = req.headers.authorization;
  console.log("Settings===", userId, head);

  if (!userId) {
    return res.status(400).json({
      message: "Error. There are no required fields",
    });
  }

  try {
    const user = User.getUserDataById(userId);
    if (!user?.id) {
      return res.status(400).json({
        message: "Error. There are no required fields",
      });
    }

    const notifications = Notification.getByUserId(user.id).reverse();

    return res.status(200).json(notifications);
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
