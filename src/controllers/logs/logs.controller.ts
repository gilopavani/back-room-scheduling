import { NextFunction, Request, Response } from "express";
import LogService from "../../services/log/log.service";

export const getAllLogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const logs = await LogService.getAllLogs(page, limit);
    res.status(200).json(logs);
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
    const logs = await LogService.getLogsByUserId(userId);
    res.status(200).json({ logs });
  } catch (error) {
    next(error);
  }
};

export const getLogsByModuleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { module } = req.params;
    const logs = await LogService.getLogsByModule(module);
    res.status(200).json({ logs });
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

    const logs = await LogService.getLogsByUserId(userId);
    res.status(200).json({ logs });
  } catch (error) {
    next(error);
  }
};
