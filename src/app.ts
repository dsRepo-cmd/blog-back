// app.ts
import createError, { HttpError } from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import route from "./route/index.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app: Application = express();

dotenv.config();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//////////////////////////////////////////

if (process.env.NODE_ENV === "development") {
  import("livereload").then((livereload) => {
    import("connect-livereload").then((connectLiveReload) => {
      const livereloadServer = livereload.default.createServer();
      const liveReloadMiddleware = connectLiveReload.default();
      app.use(liveReloadMiddleware);

      livereloadServer.watch(path.join(__dirname, "public"));
      livereloadServer.server.once("connection", () => {
        setTimeout(() => {
          livereloadServer.refresh("/");
        }, 100);
      });
    });
  });
}

app.use("/", route);

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // catch 404 and forward to error handler
  console.log(next());
  next(createError(404));
  // render the error page
  res.status(err.status || 500).json(err);
});
export default app;
