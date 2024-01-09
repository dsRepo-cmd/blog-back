import express, { Request, Response } from "express";
import { Profile } from "../class/Profile/index.js";
const router = express.Router();

// ================================================================

router.put("/profile/:id", function (req: Request, res: Response) {
  const newProfile = req.body;

  try {
    const updatedProfile = Profile.update(newProfile);

    return res.status(200).json(updatedProfile);
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

// ================================================================

router.get("/profile/:id", function (req: Request, res: Response) {
  const { id } = req.params;

  try {
    const profile = Profile.getById(id);

    return res.status(200).json(profile);
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
