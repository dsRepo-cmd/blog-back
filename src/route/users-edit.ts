import express, { Request, Response } from "express";
import { User } from "../class/User/index.js";
import { handleServerError } from "./index.js";

const router = express.Router();

// GET================================================================
router.get("/users-edit", async (req: Request, res: Response) => {
  console.log("users-edit");
  try {
    const userList = User.getUsersList();

    return res.status(200).json(userList);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

// DELETE================================================================
router.delete("/users-edit/:id", async (req: Request, res: Response) => {
  const userId = req.params.id as string;

  console.log("userId", userId);
  try {
    const isDeleted = User.deleteById(userId);
    if (!isDeleted) {
      return res.status(400).json({
        message: "User with the specified ID not found",
      });
    }

    return res.status(200).json();
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

export default router;
