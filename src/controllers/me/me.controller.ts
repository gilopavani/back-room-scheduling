import { NextFunction, Request, Response } from "express";
import {
  updateProfileService,
  getPermissionsService,
  getProfileService,
  getBookingsByUserIdService,
  getLogsByUserIdService,
} from "../../services/me/me.service";
import { CustomError } from "../../utils/custom-error";
import { getPaginationParams, getFilterParams } from "../../utils/pagination";

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

export const getBookingsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await getBookingsByUserIdService(
      userId,
      paginationParams,
      filterParams
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getLogsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.context?.userId;

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await getLogsByUserIdService(
      userId,
      paginationParams,
      filterParams
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
