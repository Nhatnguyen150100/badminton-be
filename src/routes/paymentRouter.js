"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import paymentController from "../controllers/paymentController";
const paymentRouter = express.Router();

paymentRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  paymentController.createPayment
);

paymentRouter.get("/update-user-amount", paymentController.updateUserAmount);

export default paymentRouter;
