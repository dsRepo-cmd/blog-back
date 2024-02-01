import mongoose, { Model, Schema } from "mongoose";
import { ArticleData } from "./types.js";

const articleSchema = new Schema<ArticleData>({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  title: String,
  subtitle: String,
  user: {
    id: String,
    email: String,
    username: String,
    avatar: String,
    roles: [String],
  },
  img: String,
  views: Number,
  createdAt: Date,
  type: String,
  blocks: [],
  isPublished: Boolean,
});

const ArticleModel: Model<ArticleData> = mongoose.model(
  "Article",
  articleSchema
);

export default ArticleModel;
