import { Document, Schema, model, Model, PopulatedDoc } from "mongoose";
import { User } from "../User/index.js";
import { IUserModel } from "../User/types.js";

const sessionSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

interface ISessionModel extends Document {
  token: string;
  user: PopulatedDoc<User & Document>;
}

const SessionModel: Model<ISessionModel> = model<ISessionModel>(
  "Session",
  sessionSchema
);

class Session {
  public static async initialize(): Promise<void> {}

  public static async getList(): Promise<ISessionModel[]> {
    return await SessionModel.find().populate("user").exec();
  }

  public static async addSession(sessionData: {
    token: string;
    user: User;
  }): Promise<void> {
    const session = new SessionModel(sessionData);
    await session.save();
  }

  public static async findSessionByToken(
    token: string
  ): Promise<ISessionModel | null> {
    return (
      (await SessionModel.findOne({ token }).populate("user").exec()) || null
    );
  }

  public static generateCode(): string {
    const length = 12;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const generateCharacter = () =>
      characters[Math.floor(Math.random() * characters.length)];
    const token = Array.from({ length }, generateCharacter).join("");
    return token;
  }

  public static async create(data: IUserModel): Promise<ISessionModel> {
    const token = Session.generateCode();
    const userObject = data.toObject();
    const sessionData = { token, user: userObject };
    const session = new SessionModel(sessionData);
    await session.save();
    const savedSession = await SessionModel.findOne({ token })
      .populate("user")
      .exec();
    if (!savedSession) {
      throw new Error("Failed to create session");
    }
    return savedSession;
  }
}

export default Session;
