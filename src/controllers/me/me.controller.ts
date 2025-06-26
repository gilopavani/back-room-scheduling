import { NextFunction, Request, Response } from "express";
import {
  updateProfileService,
  getPermissionsService,
  getProfileService,
} from "../../services/me/me.service";
import { CustomError } from "../../utils/custom-error";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const userProfile = await getProfileService(userId);
    res.status(200).json({ userProfile });
  } catch (error) {
    next(error);
  }
};

export const getPermissionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const userPermissions = await getPermissionsService(userId);
    res.status(200).json({ userPermissions });
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.context?.userId;
    const userData = req.body;

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const updatedUser = await updateProfileService(userId, userData);
    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};
