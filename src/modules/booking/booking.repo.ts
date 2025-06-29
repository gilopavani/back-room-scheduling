import { Booking, User, Room } from "../../database/models";
import { BookingInterface } from "../../interfaces/Booking.interface";
import { Transaction, Op } from "sequelize";
import {
  PaginationParams,
  FilterParams,
  createPaginationResult,
  PaginationResult,
} from "../../utils/pagination";

const bookingRepo = {
  getAllBookings: async (): Promise<Booking[]> => {
    return await Booking.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "lastName"],
        },
        {
          model: Room,
          as: "room",
          attributes: ["number"],
        },
      ],
    });
  },

  findBookingById: async (id: string): Promise<Booking | null> => {
    return await Booking.findByPk(id);
  },

  findBookingsByUserId: async (userId: string): Promise<Booking[]> => {
    return await Booking.findAll({
      where: { userId },
    });
  },

  findBookingsByRoomId: async (roomId: string): Promise<Booking[]> => {
    return await Booking.findAll({
      where: { roomId },
    });
  },

  findBookingsByRoomIdAndDate: async (
    roomId: string,
    date: string | Date
  ): Promise<Booking[]> => {
    return await Booking.findAll({
      where: {
        roomId,
        date,
      },
    });
  },

  createBooking: async (
    bookingData: BookingInterface,
    transaction?: Transaction
  ): Promise<Booking> => {
    const bookingDataWithStatus = {
      ...bookingData,
      status: bookingData.status || "pending",
    };
    return await Booking.create(bookingDataWithStatus, { transaction });
  },

  updateBookingStatus: async (
    id: string,
    status: "pending" | "confirmed" | "cancelled",
    transaction?: Transaction
  ): Promise<Booking | null> => {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return null;
    }
    return await booking.update({ status }, { transaction });
  },

  updateBooking: async (
    id: string,
    bookingData: Partial<BookingInterface>,
    transaction?: Transaction
  ): Promise<Booking | null> => {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return null;
    }
    return await booking.update(bookingData, { transaction });
  },

  getAllBookingsWithPagination: async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Booking>> => {
    const { page = 1, limit = 10 } = paginationParams;
    const {
      search,
      startDate,
      endDate,
      sortBy = "date",
      sortOrder = "DESC",
    } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = {};
    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName"],
        where: search
          ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
              ],
            }
          : undefined,
        required: search ? true : false,
      },
      {
        model: Room,
        as: "room",
        attributes: ["number"],
        where: search
          ? {
              number: { [Op.iLike]: `%${search}%` },
            }
          : undefined,
        required: false,
      },
    ];

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: endDate,
      };
    }

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    return createPaginationResult(rows, count, page, limit);
  },

  getBookingsByUserIdWithPagination: async (
    userId: string,
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Booking>> => {
    const { page = 1, limit = 10 } = paginationParams;
    const {
      search,
      startDate,
      endDate,
      sortBy = "date",
      sortOrder = "DESC",
    } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = { userId };

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: endDate,
      };
    }

    const includeClause = [
      {
        model: Room,
        as: "room",
        attributes: ["number"],
        where: search
          ? {
              number: { [Op.iLike]: `%${search}%` },
            }
          : undefined,
        required: search ? true : false,
      },
    ];

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return createPaginationResult(rows, count, page, limit);
  },
};
export default bookingRepo;
