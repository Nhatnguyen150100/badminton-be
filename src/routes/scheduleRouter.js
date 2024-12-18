"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import scheduleController from "../controllers/scheduleController";
const scheduleRouter = express.Router();

scheduleRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  scheduleController.getListSchedule
);

scheduleRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  scheduleController.createSchedule
);

scheduleRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  scheduleController.updatedSchedule
);

scheduleRouter.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  scheduleController.deleteSchedule
);

export default scheduleRouter;
