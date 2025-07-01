import { NextFunction, Request, Response } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  getUserPermissionsService,
  updateUserPermissionsService,
  changeUserStatusService,
} from "../../services/user/user.service";
import { getPaginationParams, getFilterParams } from "../../utils/pagination";

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await getAllUsersService(paginationParams, filterParams);
    res.status(200).json(result);
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

export const changeUserStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { status } = req.body;
    const updatedUser = await changeUserStatusService(userId, status);
    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};
