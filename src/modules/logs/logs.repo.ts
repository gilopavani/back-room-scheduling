import { Log, User } from "../../database/models";
import { LogInterface } from "../../interfaces/Log.interface";
import { Transaction, Op } from "sequelize";
import {
  PaginationParams,
  FilterParams,
  createPaginationResult,
  PaginationResult,
} from "../../utils/pagination";

const logRepo = {
  createLog: async (
    logData: LogInterface,
    transaction?: Transaction
  ): Promise<Log> => {
    return await Log.create(logData, { transaction });
  },

  getAllLogsWithPagination: async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Log>> => {
    const { page = 1, limit = 50 } = paginationParams;
    const {
      search,
      date,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = {};
    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName", "email"],
        where: search
          ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
              ],
            }
          : undefined,
        required: false,
      },
    ];

    if (search) {
      whereClause[Op.or] = [
        { activity: { [Op.iLike]: `%${search}%` } },
        { module: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.createdAt = {
        [Op.gte]: targetDate,
        [Op.lt]: nextDay,
      };
    }

    const { count, rows } = await Log.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    return createPaginationResult(rows, count, page, limit);
  },

  getLogsByUserIdWithPagination: async (
    userId: string,
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Log>> => {
    const { page = 1, limit = 50 } = paginationParams;
    const {
      search,
      date,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = { userId };

    if (search) {
      whereClause[Op.or] = [
        { activity: { [Op.iLike]: `%${search}%` } },
        { module: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.createdAt = {
        [Op.gte]: targetDate,
        [Op.lt]: nextDay,
      };
    }

    const { count, rows } = await Log.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return createPaginationResult(rows, count, page, limit);
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
