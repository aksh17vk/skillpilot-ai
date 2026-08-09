import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import routes from "./routes/index.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import adminRoutes from "./routes/admin.routes.js";

import passport from "passport";
import "./config/passport.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use(passport.initialize());

app.use("/api/v1", routes);

app.use("/api/v1/admin", adminRoutes);

app.use(errorMiddleware);

export default app;
