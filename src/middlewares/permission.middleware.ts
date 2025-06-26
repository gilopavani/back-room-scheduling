import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/custom-error";
import { User } from "../database/models";

type Permission = "logs" | "scheduling";

export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.context?.userId;

      if (!userId) {
        throw new CustomError("Invalid token", 401);
      }

      const user = await User.findByPk(userId);

      if (!user) {
        throw new CustomError("User not found", 404);
      }

      if (!user.hasPermission(permission)) {
        throw new CustomError("Access denied: Insufficient permissions", 403);
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
    const userId = req.context?.userId;

    if (!userId) {
      throw new CustomError("Invalid token", 401);
    }

    const user = await User.findByPk(userId);

    if (!user || user.role !== "admin") {
      throw new CustomError("Access denied: Administrators only", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
