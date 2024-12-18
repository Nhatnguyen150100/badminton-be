"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
import { join } from "path";

const dotenv = require("dotenv");
dotenv.config();

import multer from "multer";
import connectDB from "./config/connectDB";
import authRouter from "./routes/authRouter";
import badmintonCourtRouter from "./routes/badmintonCourtRouter";
import courtNumberRouter from "./routes/courtNumberRouter";
import profileRouter from "./routes/profileRouter";
import scheduleRouter from "./routes/scheduleRouter";
import timeBookingRouter from "./routes/timeBookingRouter";
import userBookingRouter from "./routes/userBookingRouter";
import badmintonGatherRouter from "./routes/badmintonGatherRouter";
import badmintonGatherBookingRouter from "./routes/badmintonGatherBookingRouter";
import badmintonBookingCommentRouter from "./routes/badmintonBookingCommentRouter";
const { default: loggerWinston } = require("./config/winston");

connectDB.connect();
const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL_CLIENT,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    exposedHeaders: ["X-Total-Count", "token"],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  legacyHeaders: true,
  message: "Too many requests from this IP, please try again in 5 minutes",
});
app.use(limiter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "..", "public")));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/**
 * @toto router setup
 */
app.use("/v1/auth", authRouter);
app.use("/v1/court", badmintonCourtRouter);
app.use("/v1/profile", profileRouter);
app.use("/v1/court-number", courtNumberRouter);
app.use("/v1/time-booking", timeBookingRouter);
app.use("/v1/schedule", scheduleRouter);
app.use("/v1/user-booking", userBookingRouter);
app.use("/v1/gather", badmintonGatherRouter);
app.use("/v1/gather-booking", badmintonGatherBookingRouter);
app.use("/v1/gather-comment", badmintonBookingCommentRouter);

app.listen(process.env.PORT || 3000, () => {
  loggerWinston.info("Server listening on port: " + (process.env.PORT || 3000));
});

module.exports = app;
