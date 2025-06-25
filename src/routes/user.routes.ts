import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  requirePermission,
  requireAdmin,
} from "../middlewares/permission.middleware";
import { PermissionService } from "../services/permission.service";

const router = express.Router();

router.get("/logs", authMiddleware, requirePermission("logs"), (req, res) => {
  res.json({ message: "Logs acessíveis" });
});

router.get(
  "/scheduling",
  authMiddleware,
  requirePermission("scheduling"),
  (req, res) => {
    res.json({ message: "Agendamentos acessíveis" });
  }
);

router.post(
  "/permissions/:userId/grant",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { permission } = req.body;

      await PermissionService.grantPermission(userId, permission);
      res.json({ message: "Permissão concedida com sucesso" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
