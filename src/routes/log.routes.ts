import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  requirePermission,
  requireAdmin,
} from "../middlewares/permission.middleware";
import {
  getAllLogsController,
  getLogsByUserIdController,
  getMyLogsController,
} from "../controllers/logs/logs.controller";

const router = express.Router();

router.get(
  "",
  authMiddleware,
  requirePermission("logs"),
  async (req, res, next) => {
    getAllLogsController(req, res, next);
  }
);

router.get("/my", authMiddleware, async (req, res, next) => {
  getMyLogsController(req, res, next);
});

router.get(
  "/user/:userId",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    getLogsByUserIdController(req, res, next);
  }
);

export default router;
