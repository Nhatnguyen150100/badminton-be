"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import userBookingController from "../controllers/userBookingController";
const userBookingRouter = express.Router();

userBookingRouter.get(
  "/by-user/:id",
  tokenMiddleware.verifyToken,
  userBookingController.getBookingsByUser
);

userBookingRouter.get(
  "/by-badminton-court/:id",
  tokenMiddleware.verifyToken,
  userBookingController.getBookingsByBadmintonCourt
);

userBookingRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  userBookingController.createBooking
);

userBookingRouter.put(
  "/accept-booking/:id",
  tokenMiddleware.verifyToken,
  userBookingController.changeAcceptUserBooking
);

userBookingRouter.put(
  "/denied-booking/:id",
  tokenMiddleware.verifyToken,
  userBookingController.deniedUserBooking
);

userBookingRouter.put(
  "/cancel-booking/:id",
  tokenMiddleware.verifyToken,
  userBookingController.cancelUserBooking
);

export default userBookingRouter;
