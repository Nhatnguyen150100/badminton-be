"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import profileController from "../controllers/profileController";
import { uploadAvatar } from "../config/multer";
const profileRouter = express.Router();

profileRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  uploadAvatar.single('avatar'),
  profileController.updateProfile
);

profileRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  profileController.getProfile
);



export default profileRouter;
