"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import badmintonGatherBookingController from "../controllers/badmintonGatherBookingController";
const badmintonGatherBookingRouter = express.Router();

badmintonGatherBookingRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  badmintonGatherBookingController.createGatherBooking
);

badmintonGatherBookingRouter.put(
  "/accept-gather-booking/:id",
  tokenMiddleware.verifyToken,
  badmintonGatherBookingController.acceptGatherBooking
);

badmintonGatherBookingRouter.put(
  "/denied-gather-booking/:id",
  tokenMiddleware.verifyToken,
  badmintonGatherBookingController.deniedGatherBooking
);

badmintonGatherBookingRouter.get(
  "/by-owner/:id",
  tokenMiddleware.verifyToken,
  badmintonGatherBookingController.getGatherBookingByOwner
);

badmintonGatherBookingRouter.get(
  "/by-user/:id",
  tokenMiddleware.verifyToken,
  badmintonGatherBookingController.getGatherBookingByUserId
);

// badmintonGatherBookingRouter.delete(
//   "/:id",
//   tokenMiddleware.verifyToken,
//   courtNumberController.deleteCourtNumber
// );

export default badmintonGatherBookingRouter;
