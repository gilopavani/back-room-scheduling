import { User } from "../database/models";
import { CustomError } from "../utils/custom-error";

export class PermissionService {
  static async grantPermission(
    userId: string,
    permission: "logs" | "scheduling"
  ): Promise<void> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new CustomError("Usuário não encontrado", 404);
    }

    if (user.role === "admin") {
      throw new CustomError(
        "Administradores já possuem todas as permissões",
        400
      );
    }

    const updateData: Partial<User> = {};

    switch (permission) {
      case "logs":
        updateData.canViewLogs = true;
        break;
      case "scheduling":
        updateData.canManageScheduling = true;
        break;
    }

    await user.update(updateData);
  }

  static async revokePermission(
    userId: string,
    permission: "logs" | "scheduling"
  ): Promise<void> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new CustomError("Usuário não encontrado", 404);
    }

    if (user.role === "admin") {
      throw new CustomError(
        "Não é possível revogar permissões de administradores",
        400
      );
    }

    const updateData: Partial<User> = {};

    switch (permission) {
      case "logs":
        updateData.canViewLogs = false;
        break;
      case "scheduling":
        updateData.canManageScheduling = false;
        break;
    }

    await user.update(updateData);
  }

  static async getUserPermissions(userId: string): Promise<{
    canViewLogs: boolean;
    canManageScheduling: boolean;
    isAdmin: boolean;
  }> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new CustomError("Usuário não encontrado", 404);
    }

    return {
      canViewLogs: user.hasPermission("logs"),
      canManageScheduling: user.hasPermission("scheduling"),
      isAdmin: user.role === "admin",
    };
  }
}
