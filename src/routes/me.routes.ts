import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfileController,
  getPermissionsController,
  updateProfileController,
} from "../controllers/me/me.controller";

const router = express.Router();

router.get("", authMiddleware, async (req, res, next) => {
  getProfileController(req, res, next);
});
router.get("/permission", authMiddleware, async (req, res, next) => {
  getPermissionsController(req, res, next);
});
router.patch("", authMiddleware, async (req, res, next) => {
  updateProfileController(req, res, next);
});

export default router;
