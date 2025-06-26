import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  requirePermission,
  requireAdmin,
} from "../middlewares/permission.middleware";
import {
  getAllBookingsController,
  createBookingController,
  getFreeBookingByRoomIdController,
  getBookingByRoomIdAndDateController,
  getBookingsByUserIdController,
} from "../controllers/booking/booking.controller";

const router = express.Router();

router.get("", authMiddleware, requireAdmin, async (req, res, next) => {
  getAllBookingsController(req, res, next);
});

router.get(
  "/free/:id",
  authMiddleware,
  requirePermission("scheduling"),
  async (req, res, next) => {
    getFreeBookingByRoomIdController(req, res, next);
  }
);

router.get(
  "/date/:roomId/",
  authMiddleware,
  requirePermission("scheduling"),
  async (req, res, next) => {
    getBookingByRoomIdAndDateController(req, res, next);
  }
);

router.post(
  "",
  authMiddleware,
  requirePermission("scheduling"),
  async (req, res, next) => {
    createBookingController(req, res, next);
  }
);

router.get(
  "/user/:userId",
  authMiddleware,
  requirePermission("scheduling"),
  async (req, res, next) => {
    getBookingsByUserIdController(req, res, next);
  }
);

export default router;
