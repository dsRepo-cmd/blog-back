import express, { Request, Response } from "express";
import { User } from "../class/User/index.js";

const router = express.Router();

// ================================================================

router.get("/users/:userId", function (req: Request, res: Response) {
  const userId = req.params.userId as string;

  if (!userId) {
    return res.status(400).json({
      message: "Error. There are no required fields",
    });
  }

  try {
    const user = User.getById(userId);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// ================================================================

router.patch("/users/:id", function (req: Request, res: Response) {
  const userId = req.params.id as string;
  const { jsonSettings } = req.body;

  try {
    if (jsonSettings) User.putJsonSettings(userId, jsonSettings);

    return res.status(200).json(jsonSettings);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error creating user",
    });
  }
});

// ================================================================

router.put("/users/:id", function (req: Request, res: Response) {
  const userId = req.params.id as string;
  const { roles } = req.body;

  try {
    const UpdatedRoles = User.putRoles(userId, roles);

    return res.status(200).json(UpdatedRoles);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error creating user",
    });
  }
});

export default router;
