import mongoose, { Document, Schema, Model } from "mongoose";

interface IAuthConfirmModel extends Document {
  code: number;
  data: string;
}

const authConfirmSchema = new Schema({
  code: {
    type: Number,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const AuthConfirmModel: Model<IAuthConfirmModel> =
  mongoose.model<IAuthConfirmModel>("AuthConfirm", authConfirmSchema);

interface AuthConfirmData {
  code: number;
  data: string;
}

class AuthConfirm {
  private static list: AuthConfirmData[];

  public static async initialize(): Promise<void> {
    try {
      AuthConfirm.list = await AuthConfirmModel.find().exec();
    } catch (error) {
      console.error("Error initializing AuthConfirm:", error);
    }
  }

  private static saveData = async (): Promise<void> => {
    try {
      await AuthConfirmModel.deleteMany({}); // Clear existing data
      await AuthConfirmModel.insertMany(AuthConfirm.list); // Save new data
    } catch (error) {
      console.error("Error saving AuthConfirm data:", error);
    }
  };

  public static getList(): AuthConfirmData[] {
    return AuthConfirm.list;
  }

  public static addAuthConfirm = async (
    authConfirm: AuthConfirmData
  ): Promise<void> => {
    AuthConfirm.list.push(authConfirm);
    await AuthConfirm.saveData();
  };

  public static deleteAuthConfirm = async (code: number): Promise<boolean> => {
    const length = AuthConfirm.list.length;
    AuthConfirm.list = AuthConfirm.list.filter((item) => item.code !== code);
    await AuthConfirm.saveData();
    return length > AuthConfirm.list.length;
  };

  public static getData = async (code: number): Promise<string | null> => {
    const obj = AuthConfirm.list.find((item) => item.code === code);
    return obj ? obj.data : null;
  };

  public code: number;
  public data: string;

  constructor(data: string) {
    this.code = AuthConfirm.generateCode();
    this.data = data;
  }

  public static generateCode(): number {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  public static create = async (data: string): Promise<AuthConfirm> => {
    const newAuthConfirm = new AuthConfirm(data);
    await AuthConfirm.addAuthConfirm(newAuthConfirm);

    setTimeout(async () => {
      await AuthConfirm.deleteAuthConfirm(newAuthConfirm.code);
    }, 24 * 60 * 60 * 1000);

    return newAuthConfirm;
  };

  public static delete = async (code: number): Promise<boolean> => {
    return await AuthConfirm.deleteAuthConfirm(code);
  };
}

AuthConfirm.initialize(); // Initialize on application startup

export default AuthConfirm;
