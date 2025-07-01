import { CustomError } from "../../utils/custom-error";
import roomRepo from "../../modules/room/room.repo";
import bookingRepo from "../../modules/booking/booking.repo";
import { RoomInterface } from "../../interfaces/room.interface";
import LogService from "../log/log.service";
import {
  createRoomValidator,
  updateRoomValidator,
} from "../../modules/room/room.validator";

export const getAllRoomsService = async () => {
  try {
    const rooms = await roomRepo.getAllRooms();
    return rooms;
  } catch (error) {
    throw new CustomError("Failed to fetch rooms", 500);
  }
};

export const getRoomByIdService = async (roomId: string) => {
  try {
    if (!roomId) {
      throw new CustomError("Room ID is required", 400);
    }
    const room = await roomRepo.findRoomById(roomId);
    if (!room) {
      throw new CustomError("Room not found", 404);
    }
    return room;
  } catch (error) {
    throw new CustomError("Failed to fetch room", 500);
  }
};

export const createRoomService = async (roomData: RoomInterface) => {
  try {
    const { error } = createRoomValidator(roomData);
    if (error) {
      throw new CustomError(error.message, 400);
    }
    const newRoom = await roomRepo.createRoom(roomData);
    return newRoom;
  } catch (error) {
    throw new CustomError("Failed to create room", 500);
  }
};

export const updateRoomService = async (roomId: string, roomData: any) => {
  try {
    if (!roomId) {
      throw new CustomError("Room ID is required", 400);
    }

    const { error } = updateRoomValidator(roomData);
    if (error) {
      throw new CustomError(error.message, 400);
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const pendingBookings = await bookingRepo.findBookingsByRoomIdAndStatus(
      roomId,
      ["pending"]
    );

    const approvedBookingsFromToday =
      await bookingRepo.findBookingsByRoomIdStatusAndDate(
        roomId,
        ["confirmed"],
        currentDate
      );

    const bookingsToCancel = [...pendingBookings, ...approvedBookingsFromToday];

    if (bookingsToCancel.length > 0) {
      const bookingIds = bookingsToCancel.map((booking) => booking.id);
      await bookingRepo.cancelMultipleBookings(bookingIds);

      bookingsToCancel.forEach((booking) => {
        LogService.logActivity(
          booking.userId,
          "booking",
          "Cancelamento automático por modificação de sala",
          `Booking cancelado automaticamente devido à modificação da sala ${roomId}`,
          undefined
        );
      });
    }

    const updatedRoom = await roomRepo.updateRoom(roomId, roomData);
    if (!updatedRoom) {
      throw new CustomError("Room not found or failed to update", 404);
    }

    LogService.logActivity(
      "system",
      "booking",
      "Modificação de sala",
      `Sala ${roomId} modificada. ${bookingsToCancel.length} bookings cancelados automaticamente`,
      undefined
    );

    return updatedRoom;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to update room", 500);
  }
};
