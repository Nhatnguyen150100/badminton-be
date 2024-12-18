"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import courtNumberController from "../controllers/courtNumberController";
const courtNumberRouter = express.Router();

courtNumberRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  courtNumberController.getListCourtNumbers
);

courtNumberRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  courtNumberController.createCourtNumber
);

courtNumberRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  courtNumberController.updateCourtNumber
);

courtNumberRouter.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  courtNumberController.deleteCourtNumber
);

export default courtNumberRouter;
