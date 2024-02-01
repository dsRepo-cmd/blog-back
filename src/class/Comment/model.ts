import { Model, Schema, model } from "mongoose";
import { ICommentModel } from "./types.js";

const commentSchema = new Schema<ICommentModel>({
  articleId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const CommentModel: Model<ICommentModel> = model<ICommentModel>(
  "Comment",
  commentSchema
);

export default CommentModel;
