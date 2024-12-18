"use strict";
import express from "express";
import authController from "../controllers/auth/authController";
import authMiddleware from "../middleware/authMiddleware";
import passportController from "../controllers/auth/passportController";
const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.get("/google", passportController.authenticateByGoogle);
authRouter.get("/google/callback", passportController.authenticateCallback);
authRouter.post(
  "/register",
  authMiddleware.checkUserExist,
  authController.register
);

export default authRouter;
