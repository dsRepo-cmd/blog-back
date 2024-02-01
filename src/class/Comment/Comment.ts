import { CommentArgs, CommentData } from "./types.js";
import User from "../User/User.js";
import CommentModel from "./model.js";

class Comment {
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
