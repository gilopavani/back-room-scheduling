import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfileController,
  getPermissionsController,
  updateProfileController,
  getBookingsByUserIdController,
  getLogsByUserIdController,
} from "../controllers/me/me.controller";
import { requirePermission } from "../middlewares/permission.middleware";

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
router.get(
  "/bookings",
  authMiddleware,
  requirePermission("scheduling"),
  async (req, res, next) => {
    getBookingsByUserIdController(req, res, next);
  }
);
router.get(
  "/logs",
  authMiddleware,
  requirePermission("logs"),
  async (req, res, next) => {
    getLogsByUserIdController(req, res, next);
  }
);

export default router;
