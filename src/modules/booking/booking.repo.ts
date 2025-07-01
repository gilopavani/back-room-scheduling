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
    status: "pending" | "confirmed" | "cancelled"
  ): Promise<Booking | null> => {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return null;
    }
    return await booking.update({ status });
  },

  updateBooking: async (
    id: string,
    bookingData: Partial<BookingInterface>
  ): Promise<Booking | null> => {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return null;
    }
    return await booking.update(bookingData);
  },

  getAllBookingsWithPagination: async (
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Booking>> => {
    const { page = 1, limit = 10 } = paginationParams;
    const { search, date, sortBy = "date", sortOrder = "DESC" } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.date = {
        [Op.gte]: targetDate.toISOString().split("T")[0],
        [Op.lt]: nextDay.toISOString().split("T")[0],
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { "$user.name$": { [Op.like]: `%${search}%` } },
        { "$user.last_name$": { [Op.like]: `%${search}%` } },
        { "$room.number$": { [Op.like]: `%${search}%` } },
      ];
    }

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName", "role"],
        required: false,
      },
      {
        model: Room,
        as: "room",
        attributes: ["number"],
        required: false,
      },
    ];

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
      subQuery: false,
      logging: console.log,
    });

    return createPaginationResult(rows, count, page, limit);
  },

  getBookingsByUserIdWithPagination: async (
    userId: string,
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<PaginationResult<Booking>> => {
    const { page = 1, limit = 10 } = paginationParams;
    const { search, date, sortBy = "date", sortOrder = "DESC" } = filterParams;
    const offset = (page - 1) * limit;

    const whereClause: any = { userId };

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.date = {
        [Op.gte]: targetDate.toISOString().split("T")[0],
        [Op.lt]: nextDay.toISOString().split("T")[0],
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { "$user.name$": { [Op.like]: `%${search}%` } },
        { "$user.last_name$": { [Op.like]: `%${search}%` } },
        { "$room.number$": { [Op.like]: `%${search}%` } },
      ];
    }

    const includeClause = [
      {
        model: User,
        as: "user",
        attributes: ["name", "lastName", "role"],
        required: false,
      },
      {
        model: Room,
        as: "room",
        attributes: ["number"],
        required: false,
      },
    ];

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
      subQuery: false,
      logging: console.log,
    });

    return createPaginationResult(rows, count, page, limit);
  },

  findBookingsByRoomIdAndStatus: async (
    roomId: string,
    statuses: ("pending" | "confirmed" | "cancelled")[]
  ): Promise<Booking[]> => {
    return await Booking.findAll({
      where: {
        roomId,
        status: {
          [Op.in]: statuses,
        },
      },
    });
  },

  findBookingsByRoomIdStatusAndDate: async (
    roomId: string,
    statuses: ("pending" | "confirmed" | "cancelled")[],
    fromDate: Date
  ): Promise<Booking[]> => {
    return await Booking.findAll({
      where: {
        roomId,
        status: {
          [Op.in]: statuses,
        },
        date: {
          [Op.gte]: fromDate,
        },
      },
    });
  },

  findConflictingBookings: async (
    roomId: string,
    date: Date | string,
    time: string,
    excludeBookingId?: string
  ): Promise<Booking[]> => {
    const whereClause: any = {
      roomId,
      date,
      time,
      status: {
        [Op.in]: ["pending", "confirmed"],
      },
    };

    if (excludeBookingId) {
      whereClause.id = {
        [Op.ne]: excludeBookingId,
      };
    }

    return await Booking.findAll({
      where: whereClause,
    });
  },

  cancelMultipleBookings: async (
    bookingIds: string[],
    transaction?: Transaction
  ): Promise<number> => {
    const [updatedCount] = await Booking.update(
      { status: "cancelled" },
      {
        where: {
          id: {
            [Op.in]: bookingIds,
          },
        },
        transaction,
      }
    );
    return updatedCount;
  },
};
export default bookingRepo;
