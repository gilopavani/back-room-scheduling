import { Request } from "express";
import { LogInterface } from "../../interfaces/Log.interface";
import logRepo from "../../modules/logs/logs.repo";
import { CustomError } from "../../utils/custom-error";

class LogService {
  static async createLog(logData: LogInterface): Promise<void> {
    try {
      await logRepo.createLog(logData);
    } catch (error) {
      console.error("Erro ao criar log:", error);
    }
  }

  static async logActivity(
    userId: string,
    module: "account" | "booking",
    activity: string,
    details?: string,
    req?: Request
  ): Promise<void> {
    const logData: LogInterface = {
      userId,
      module,
      activity,
      details,
    };

    await this.createLog(logData);
  }

  static async getAllLogs(page: number = 1, limit: number = 50) {
    try {
      return await logRepo.getAllLogs(page, limit);
    } catch (error) {
      throw new CustomError("Failed to retrieve logs", 500);
    }
  }

  static async getLogsByUserId(userId: string) {
    try {
      if (!userId) {
        throw new CustomError("User ID is required", 400);
      }
      return await logRepo.getLogsByUserId(userId);
    } catch (error) {
      throw new CustomError("Failed to retrieve user logs", 500);
    }
  }

  static async getLogsByModule(module: string) {
    try {
      return await logRepo.getLogsByModule(module);
    } catch (error) {
      throw new CustomError("Failed to retrieve module logs", 500);
    }
  }
}

export default LogService;
