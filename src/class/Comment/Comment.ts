import { Document, Schema, model, Model } from "mongoose";
import { CommentArgs, CommentData } from "./types.js";
import User from "../User/User.js";

interface ICommentModel extends Document {
  articleId: string;
  userId: string;
  text: string;
}

const commentSchema = new Schema({
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

class Comment {
  public static async initialize(): Promise<void> {}

  public static async create(data: CommentArgs): Promise<CommentData> {
    const comment = new CommentModel(data);
    await comment.save();

    const user = await User.getUserDataById(comment.userId);

    if (user) {
      return {
        id: comment._id.toString(),
        user,
        text: comment.text,
        articleId: comment.articleId,
        userId: comment.userId,
      };
    }

    throw new Error("User not found for comment");
  }

  public static async getByArticleId(
    articleId: string
  ): Promise<CommentData[] | []> {
    const comments = await CommentModel.find({ articleId }).exec();

    if (comments.length === 0) {
      return [];
    }

    const commentDataList: CommentData[] = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.getUserDataById(comment.userId);

        if (user) {
          return {
            id: comment._id.toString(),
            user,
            text: comment.text,
            articleId: comment.articleId,
            userId: comment.userId,
          };
        }

        throw new Error("User not found for comment");
      })
    );

    return commentDataList;
  }
}

export default Comment;
