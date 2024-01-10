import express, { Request, Response } from "express";
import { Profile } from "../class/Profile/index.js";
import { handleServerError } from "./index.js";

const router = express.Router();

// ================================================================
router.put("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const newProfile = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Error. 'id' parameter is required",
    });
  }

  if (!newProfile) {
    return res.status(400).json({
      message: "Error. 'newProfile' is required in the request body",
    });
  }

  try {
    const updatedProfile = await Profile.update(newProfile);

    if (!updatedProfile) {
      return res.status(404).json({
        message: "Error. Failed to update profile",
      });
    }

    return res.status(200).json(updatedProfile);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

// ================================================================
router.get("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Error. 'id' parameter is required",
    });
  }

  try {
    const profile = await Profile.getById(id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found for the specified id",
      });
    }

    return res.status(200).json(profile);
  } catch (error: unknown) {
    return handleServerError(res, error);
  }
});

export default router;
