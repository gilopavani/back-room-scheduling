import { NextFunction, Request, Response } from "express";
import LogService from "../../services/log/log.service";
import { getPaginationParams, getFilterParams } from "../../utils/pagination";

export const getAllLogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await LogService.getAllLogs(paginationParams, filterParams);
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
    const { userId } = req.params;
    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await LogService.getLogsByUserId(
      userId,
      paginationParams,
      filterParams
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyLogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.context?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
    }

    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await LogService.getLogsByUserId(
      userId,
      paginationParams,
      filterParams
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
