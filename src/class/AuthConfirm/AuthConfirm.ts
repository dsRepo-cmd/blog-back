import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const dataFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "bd",
  "authConfirm.json"
);

interface AuthConfirmData {
  code: number;
  data: string;
}

class AuthConfirm {
  private static list: AuthConfirmData[];

  //=====Save/Load==========================================BD

  private static loadData = (): AuthConfirmData[] => {
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };

  private static saveData = (): void => {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(AuthConfirm.list, null, 2),
      "utf8"
    );
  };

  public static initialize(): void {
    AuthConfirm.list = AuthConfirm.loadData();
  }
  //=========================================================

  public static getList(): AuthConfirmData[] {
    return AuthConfirm.list;
  }

  public static addAuthConfirm(Authconfirm: AuthConfirmData): void {
    AuthConfirm.list.push(Authconfirm);
    AuthConfirm.saveData();
  }

  public static deleteAuthConfirm(code: number): boolean {
    const length = AuthConfirm.list.length;
    AuthConfirm.list = AuthConfirm.list.filter((item) => item.code !== code);
    AuthConfirm.saveData();
    return length > AuthConfirm.list.length;
  }

  public static getData(code: number): string | null {
    const obj = AuthConfirm.list.find((item) => item.code === code);
    return obj ? obj.data : null;
  }

  public code: number;
  public data: string;

  constructor(data: string) {
    this.code = AuthConfirm.generateCode();
    this.data = data;
  }

  public static generateCode(): number {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  public static create(data: string): AuthConfirm {
    const newAuthConfirm = new AuthConfirm(data);
    AuthConfirm.addAuthConfirm(newAuthConfirm);

    setTimeout(() => {
      AuthConfirm.deleteAuthConfirm(newAuthConfirm.code);
    }, 24 * 60 * 60 * 1000);

    return newAuthConfirm;
  }

  public static delete(code: number): boolean {
    return AuthConfirm.deleteAuthConfirm(code);
  }
}

AuthConfirm.initialize();

export default AuthConfirm;
