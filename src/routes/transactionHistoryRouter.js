"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import transactionHistoryController from "../controllers/transactionHistoryController";
const transactionHistoryRouter = express.Router();

transactionHistoryRouter.get(
  "/",
  tokenMiddleware.verifyToken,
  transactionHistoryController.getAllTransactions
);

export default transactionHistoryRouter;
