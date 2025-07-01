import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/permission.middleware";
import {
  getAllUsersController,
  getUserByIdController,
  getUserPermissionsController,
  updateUserPermissionsController,
  changeUserStatusController,
} from "../controllers/user/user.controller";

const router = express.Router();

router.get("", authMiddleware, requireAdmin, async (req, res, next) => {
  getAllUsersController(req, res, next);
});

router.get("/:userId", authMiddleware, requireAdmin, async (req, res, next) => {
  getUserByIdController(req, res, next);
});

router.get(
  "/:userId/permissions",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    getUserPermissionsController(req, res, next);
  }
);

router.patch(
  "/:userId/permissions",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    updateUserPermissionsController(req, res, next);
  }
);

router.patch(
  "/:userId/status",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    changeUserStatusController(req, res, next);
  }
);

export default router;
