import express, { Router, Request, Response } from "express";
const router: Router = express.Router();

import auth from "./auth.js";
import profile from "./profile.js";
import users from "./users.js";
import notifications from "./notifications.js";
import articles from "./articles.js";
import article from "./article.js";
import articleRatings from "./article-ratings.js";
import comments from "./comments.js";

router.use("/", auth);
router.use("/", profile);
router.use("/", users);
router.use("/", notifications);
router.use("/", articles);
router.use("/", article);
router.use("/", articleRatings);
router.use("/", comments);

router.get("/", (req: Request, res: Response) => {
  res.status(200).json("Hello World");
});

export default router;
