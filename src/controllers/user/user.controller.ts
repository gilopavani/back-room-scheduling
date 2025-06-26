import { NextFunction, Request, Response } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  getUserPermissionsService,
  updateUserPermissionsService,
} from "../../services/user/user.service";

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await getUserByIdService(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getUserPermissionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const userPermissions = await getUserPermissionsService(userId);
    res.status(200).json({ userPermissions });
  } catch (error) {
    next(error);
  }
};

export const updateUserPermissionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const permissions = req.body.permissions;
    const updatedUser = await updateUserPermissionsService(userId, permissions);
    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};
