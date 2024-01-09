import express, { Request, Response } from "express";
import { User } from "../class/User/index.js";
import { Notification, NotificationType } from "../class/Notification/index.js";
import { Session } from "../class/Session/index.js";
import { AuthConfirm } from "../class/AuthConfirm/index.js";

const router = express.Router();

/////=======================================================================

router.post("/signup", function (req: Request, res: Response) {
  const { email, password } = req.body;

  console.log("===================", email, password);

  if (!email || !password) {
    return res.status(400).json({
      message: "Error. There are no required fields",
    });
  }

  try {
    const isUser = User.getByEmail(email);

    if (isUser) {
      return res.status(401).json({
        message: "A user with the same name is already exist",
      });
    }

    const newUser = User.create({ email, password });

    Notification.createNotification({
      userId: newUser.id,
      type: NotificationType.ANNOUNCEMENT,
      message: "Create account",
    });

    const sessionData = User.confirmByEmail(email);

    if (!sessionData) {
      return res.status(401).json({
        message: "User with this email not found",
      });
    }
    const { token } = Session.create(sessionData);

    const { code } = AuthConfirm.create(newUser.email);

    console.log("token===", token, "code", code);

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
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
// ================================================================

router.post("/signup-confirm", function (req: Request, res: Response) {
  const { code, token } = req.body;

  if (!code || !token) {
    return res.status(401).json({
      message: "Error. There are no required fields",
    });
  }

  try {
    const session = Session.findSessionByToken(token);

    if (!session) {
      return res.status(400).json({
        message: "Error. You are not logged in",
      });
    }

    const email = AuthConfirm.getData(Number(code));

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

    User.confirmByEmail(email);

    const user = User.getByEmail(email);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// ================================================================

router.post("/login", function (req: Request, res: Response) {
  const { email, password } = req.body;

  console.log("LOGIN ", email, password);

  if (!email || !password) {
    return res.status(400).json({
      message: "Error. There are no required fields",
    });
  }

  try {
    const isUser = User.getByEmail(email);

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

    Notification.createNotification({
      userId: isUser.id,
      type: NotificationType.ANNOUNCEMENT,
      message: "Enter account",
    });

    const sessionData = User.confirmByEmail(email);

    if (!sessionData) {
      return res.status(401).json({
        message: "User with this email not found",
      });
    }

    const session = Session.create(sessionData);
    const user = User.getByEmail(email);

    return res.status(200).json({
      message: "You are logged in",
      token: session.token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
// ================================================================

router.post("/recovery", function (req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Error. There are no required fields",
    });
  }

  try {
    const user = User.getByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Such a user with such e-mail does not exist",
      });
    }

    const sessionData = User.confirmByEmail(email);

    if (!sessionData) {
      return res.status(401).json({
        message: "User with this email not found",
      });
    }
    Session.create(sessionData);

    Notification.createNotification({
      userId: user.id,
      type: NotificationType.WARNING,
      message: "Recovery password",
    });

    AuthConfirm.create(email);

    return res.status(200).json({
      message: "Password recovery code has been sent to your e-mail",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
// ================================================================

router.post("/recovery-confirm", function (req: Request, res: Response) {
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

    const user = User.confirmByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "The user with this e-mail does not exist",
      });
    }

    const session = Session.create(user);

    return res.status(200).json({
      message: "The password has been changed",
      session,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
