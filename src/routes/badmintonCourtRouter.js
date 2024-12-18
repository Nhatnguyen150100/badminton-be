"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import badmintonCourtController from "../controllers/badmintonCourtController";
import badmintonCourtMiddleware from "../middleware/badmintonCourtMiddleware";
import { uploadImgCourt } from "../config/multer";
const badmintonCourtRouter = express.Router();

badmintonCourtRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  uploadImgCourt.single("imageCourt"),
  badmintonCourtController.createBadmintonCourt
);

badmintonCourtRouter.get("/", badmintonCourtController.getListBadmintonCourt);

badmintonCourtRouter.get(
  "/manager/:id",
  badmintonCourtController.getListBadmintonCourtManager
);

badmintonCourtRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  badmintonCourtController.getBadmintonCourt
);

badmintonCourtRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  badmintonCourtMiddleware.checkCourtOwner,
  uploadImgCourt.single("imageCourt"),
  badmintonCourtController.updateBadmintonCourt
);

badmintonCourtRouter.get(
  "/admin/list-court",
  tokenMiddleware.verifyTokenAdmin,
  badmintonCourtController.getListBadmintonCourtAdmin
);

badmintonCourtRouter.put(
  "/status/:id",
  tokenMiddleware.verifyTokenAdmin,
  badmintonCourtController.changeStatusBadmintonCourt
);

badmintonCourtRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  badmintonCourtController.deleteBadmintonCourt
);

export default badmintonCourtRouter;
