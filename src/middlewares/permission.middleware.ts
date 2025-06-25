import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/custom-error";
import { User } from "../database/models";

type Permission = "logs" | "scheduling";

export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.context?.sub;

      if (!userId) {
        throw new CustomError("Token inválido", 401);
      }

      const user = await User.findByPk(userId);

      if (!user) {
        throw new CustomError("Usuário não encontrado", 404);
      }

      if (!user.hasPermission(permission)) {
        throw new CustomError("Acesso negado: permissão insuficiente", 403);
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.context?.sub;

    if (!userId) {
      throw new CustomError("Token inválido", 401);
    }

    const user = await User.findByPk(userId);

    if (!user || user.role !== "admin") {
      throw new CustomError("Acesso negado: apenas administradores", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
