import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  requirePermission,
  requireAdmin,
} from "../middlewares/permission.middleware";
import {
  getAllRoomsController,
  getRoomByIdController,
  createRoomController,
  updateRoomController,
} from "../controllers/room/room.controller";
const router = express.Router();
router.get(
  "",
  authMiddleware,
  requirePermission("scheduling"),
  async (req, res, next) => {
    getAllRoomsController(req, res, next);
  }
);

router.get(
  "/:roomId",
  authMiddleware,
  requirePermission("scheduling"),
  async (req, res, next) => {
    getRoomByIdController(req, res, next);
  }
);

router.post("", authMiddleware, requireAdmin, async (req, res, next) => {
  createRoomController(req, res, next);
});

router.patch(
  "/:roomId",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    updateRoomController(req, res, next);
  }
);

export default router;
