"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import badmintonGatherCommentController from "../controllers/badmintonGatherCommentController";
const badmintonBookingCommentRouter = express.Router();

badmintonBookingCommentRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  badmintonGatherCommentController.createComment
);

badmintonBookingCommentRouter.get(
  "/",
  tokenMiddleware.verifyToken,
  badmintonGatherCommentController.getCommentByGatherId
);

export default badmintonBookingCommentRouter;
