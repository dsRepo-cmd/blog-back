import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();

import fs from "fs";
import { handleServerError } from "./index.js";
import axios from "axios";

const publicModuleDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public"
);

router.use("/pictures", express.static(publicModuleDir));

router.post("/pictures", async (req, res) => {
  try {
    const { imageUrl, imageName } = req.body;
    console.log(imageUrl, imageName);
    // Loading an image by URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Saving the image on the server
    const imagePath = path.join(publicModuleDir, imageName);

    fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

    res
      .status(200)
      .json({ success: true, message: "Image uploaded successfully" });
  } catch (error) {
    return handleServerError(res, error);
  }
});

export default router;
