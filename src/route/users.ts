import express, { Request, Response } from "express";
import { User } from "../class/User/index.js";
import { handleServerError } from "./index.js";

const router = express.Router();

// ================================================================
router.get("/users/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  if (!userId) {
    return res.status(400).json({
      message: "Error. 'userId' parameter is required",
    });
  }

  try {
    const user = await User.getById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found for the specified userId",
      });
    }

    return res.status(200).json(user);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

// ================================================================
router.patch("/users/:id", async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const { jsonSettings } = req.body;

  if (!jsonSettings) {
    return res.status(400).json({
      message: "Error. 'jsonSettings' is required in the request body",
    });
  }

  try {
    await User.putJsonSettings(userId, jsonSettings);

    return res.status(200).json(jsonSettings);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

// ================================================================
router.put("/users/:id", async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const { roles } = req.body;

  if (!roles) {
    return res.status(400).json({
      message: "Error. 'roles' is required in the request body",
    });
  }

  try {
    const updatedRoles = await User.putRoles(userId, roles);

    return res.status(200).json(updatedRoles);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

export default router;
