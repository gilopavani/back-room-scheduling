import { Log, User } from "../../database/models";
import { LogInterface } from "../../interfaces/Log.interface";
import { Transaction } from "sequelize";

const logRepo = {
  createLog: async (
    logData: LogInterface,
    transaction?: Transaction
  ): Promise<Log> => {
    return await Log.create(logData, { transaction });
  },

  getAllLogs: async (
    page: number = 1,
    limit: number = 50
  ): Promise<{
    logs: Log[];
    total: number;
    totalPages: number;
  }> => {
    const offset = (page - 1) * limit;

    const { count, rows } = await Log.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      logs: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  },

  getLogsByUserId: async (userId: string): Promise<Log[]> => {
    return await Log.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
  },

  getLogsByModule: async (module: string): Promise<Log[]> => {
    return await Log.findAll({
      where: { module },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
  },

  getLogsByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<Log[]> => {
    return await Log.findAll({
      where: {
        createdAt: {
          $between: [startDate, endDate],
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },
};

export default logRepo;
