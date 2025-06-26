import { Booking, User, Room } from "../../database/models";
import { BookingInterface } from "../../interfaces/Booking.interface";
import { Transaction } from "sequelize";

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
};
export default bookingRepo;
