import express, { Request, Response } from "express";
import { User } from "../class/User/index.js";
import { Notification, NotificationType } from "../class/Notification/index.js";
import { Session } from "../class/Session/index.js";
import { AuthConfirm } from "../class/AuthConfirm/index.js";
import { handleServerError } from "./index.js";

const router = express.Router();

/////=======================================================================
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Error. 'email' and 'password' are required fields",
    });
  }

  try {
    const isUser = await User.getByEmail(email);

    if (isUser) {
      return res.status(401).json({
        message: "A user with the same email already exists",
      });
    }

    const newUser = await User.create({ email, password });

    await Notification.createNotification({
      userId: newUser.id,
      type: NotificationType.ANNOUNCEMENT,
      message: "Create account",
    });

    const sessionData = await User.confirmByEmail(email);

    if (!sessionData) {
      return res.status(401).json({
        message: "User with this email not found",
      });
    }

    const { token } = await Session.create(sessionData);

    const { code } = await AuthConfirm.create(newUser.email);

    return res.status(200).json({
      message: "The user is successfully registered",
      token,
      code,
      id: newUser.id,
      email: newUser.email,
      roles: ["USER"],
      isConfirm: newUser.isConfirm,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});

// ================================================================
router.post("/signup-confirm", async (req: Request, res: Response) => {
  const { code, token } = req.body;

  if (!code || !token) {
    return res.status(401).json({
      message: "Error. 'code' and 'token' are required fields",
    });
  }

  try {
    const session = await Session.findSessionByToken(token);

    if (!session) {
      return res.status(400).json({
        message: "Error. You are not logged in",
      });
    }

    const email = await AuthConfirm.getData(Number(code));

    if (!email) {
      return res.status(400).json({
        message: "The code does not exist",
      });
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: "The code is not valid",
      });
    }

    await User.confirmByEmail(email);

    const user = await User.getByEmail(email);

    return res.status(200).json(user);
  } catch (error) {
    return handleServerError(res, error);
  }
});

// ================================================================
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Error. 'email' and 'password' are required fields",
    });
  }

  try {
    const isUser = await User.getByEmail(email);

    if (!isUser) {
      return res.status(400).json({
        message: "Error. User with this e-mail does not exist",
      });
    }

    if (isUser.password !== password) {
      return res.status(400).json({
        message: "Error. The password does not match",
      });
    }

    await Notification.createNotification({
      userId: isUser.id,
      type: NotificationType.ANNOUNCEMENT,
      message: "Enter account",
    });

    const sessionData = await User.confirmByEmail(email);

    if (!sessionData) {
      return res.status(401).json({
        message: "User with this email not found",
      });
    }

    const session = await Session.create(sessionData);
    const user = await User.getByEmail(email);

    return res.status(200).json({
      message: "You are logged in",
      token: session.token,
      user,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});
// ================================================================
router.post("/recovery", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Error. 'email' is a required field",
    });
  }

  try {
    const user = await User.getByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Such a user with such e-mail does not exist",
      });
    }

    const sessionData = await User.confirmByEmail(email);

    if (!sessionData) {
      return res.status(401).json({
        message: "User with this email not found",
      });
    }

    await Session.create(sessionData);

    await Notification.createNotification({
      userId: user.id,
      type: NotificationType.WARNING,
      message: "Recovery password",
    });

    await AuthConfirm.create(email);

    return res.status(200).json({
      message: "Password recovery code has been sent to your e-mail",
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});
// ================================================================

router.post("/recovery-confirm", async function (req: Request, res: Response) {
  const { password, code } = req.body;

  if (!code || !password) {
    return res.status(400).json({
      message: "Error. There are no required fields",
    });
  }

  try {
    const email = AuthConfirm.getData(Number(code));

    if (!email) {
      return res.status(401).json({
        message: "No such code exists",
      });
    }

    const user = await User.confirmByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "The user with this e-mail does not exist",
      });
    }

    const session = await Session.create(user);

    return res.status(200).json({
      message: "The password has been changed",
      session,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});

export default router;
