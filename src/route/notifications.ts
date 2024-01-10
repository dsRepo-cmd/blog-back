import express, { Request, Response } from "express";
import { User } from "../class/User/index.js";
import { Notification } from "../class/Notification/index.js";
import { handleServerError } from "./index.js";

const router = express.Router();

router.get("/notifications/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({
      message: "Error. 'userId' parameter is required",
    });
  }

  try {
    const user = await User.getUserDataById(userId);

    if (!user?.id) {
      return res.status(400).json({
        message: "Error. User not found for the provided userId",
      });
    }

    const notifications = await Notification.getByUserId(user.id);

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({
        message: "No notifications found for the specified userId",
      });
    }

    return res.status(200).json(notifications.reverse());
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

export default router;
