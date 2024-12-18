"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import { uploadBadmintonGather } from "../config/multer";
import badmintonGatherController from "../controllers/badmintonGatherController";
const badmintonGatherRouter = express.Router();

badmintonGatherRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  uploadBadmintonGather.single("imgCourt"),
  badmintonGatherController.createBadmintonGather
);

badmintonGatherRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  uploadBadmintonGather.single("imgCourt"),
  badmintonGatherController.updateBadmintonGather
);

badmintonGatherRouter.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  badmintonGatherController.deleteBadmintonGather
);

badmintonGatherRouter.get(
  "/list-badminton-gather/:id",
  tokenMiddleware.verifyToken,
  badmintonGatherController.getListBadmintonGathersByUserId
);

badmintonGatherRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  badmintonGatherController.getBadmintonGatherDetail
);

badmintonGatherRouter.get(
  "/",
  badmintonGatherController.getListBadmintonGather
);

export default badmintonGatherRouter;
