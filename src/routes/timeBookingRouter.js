"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import timeBookingController from "../controllers/timeBookingController";
const timeBookingRouter = express.Router();

timeBookingRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  timeBookingController.getListTimeBookings
);

timeBookingRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  timeBookingController.createTimeBooking
);

timeBookingRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  timeBookingController.updateTimeBooking
);

timeBookingRouter.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  timeBookingController.deleteTimeBooking
);

export default timeBookingRouter;
