import { CustomError } from "../../utils/custom-error";
import bookingRepo from "../../modules/booking/booking.repo";
import { BookingInterface } from "../../interfaces/Booking.interface";
import { RoomInterface } from "../../interfaces/room.interface";
import roomRepo from "../../modules/room/room.repo";
import { createBookingValidator } from "../../modules/booking/booking.validator";
import userRepo from "../../modules/user/user.repo";
import LogService from "../log/log.service";

const getAvailableSlots = (
  room: RoomInterface,
  bookings: BookingInterface[]
): string[] => {
  const { startTime, endTime, timeBlock } = room;

  const [h0, m0] = startTime.split(":").map(Number);
  const [h1, m1] = endTime.split(":").map(Number);
  const start = h0 * 60 + m0;
  const end = h1 * 60 + m1;

  const totalBlocks = Math.floor((end - start) / timeBlock);
  const occupied = Array(totalBlocks).fill(false);

  const confirmed = bookings.filter((b) => b.status === "confirmed");

  confirmed.forEach((b) => {
    const [bh, bm] = b.time.split(":").map(Number);
    const bStart = bh * 60 + bm;
    const blockIndex = Math.floor((bStart - start) / timeBlock);
    if (blockIndex >= 0 && blockIndex < totalBlocks) {
      occupied[blockIndex] = true;
    }
  });

  const available: string[] = [];
  for (let i = 0; i < totalBlocks; i++) {
    if (!occupied[i]) {
      const t = start + i * timeBlock;
      const hh = String(Math.floor(t / 60)).padStart(2, "0");
      const mm = String(t % 60).padStart(2, "0");
      available.push(`${hh}:${mm}`);
    }
  }

  return available;
};

const isSlotAvailable = (
  room: RoomInterface,
  bookings: BookingInterface[],
  desiredTime: string
): boolean => {
  const { startTime, endTime, timeBlock } = room;
  const [h0, m0] = startTime.split(":").map(Number);
  const [h1, m1] = endTime.split(":").map(Number);
  const startMinutes = h0 * 60 + m0;
  const endMinutes = h1 * 60 + m1;

  const [dh, dm] = desiredTime.split(":").map(Number);
  const desiredStart = dh * 60 + dm;
  const desiredEnd = desiredStart + timeBlock;

  if (desiredStart < startMinutes || desiredEnd > endMinutes) {
    return false;
  }

  const confirmed = bookings.filter((b) => b.status === "confirmed");

  const hasOverlap = confirmed.some((b) => {
    const [bh, bm] = b.time.split(":").map(Number);
    const bStart = bh * 60 + bm;
    const bEnd = bStart + timeBlock;
    return desiredStart < bEnd && bStart < desiredEnd;
  });

  return !hasOverlap;
};

export const getAllBookingsService = async () => {
  try {
    const bookings = await bookingRepo.getAllBookings();
    return bookings;
  } catch (error) {
    throw new CustomError("Failed to retrieve bookings", 500);
  }
};

export const getFreeBookingByRoomIdandDateService = async (
  id: string,
  date: string
) => {
  try {
    if (!id) {
      throw new CustomError("Booking ID is required", 400);
    }

    const room = await roomRepo.findRoomById(id);
    if (!room) {
      throw new CustomError("Room not found", 404);
    }

    const bookings = await bookingRepo.findBookingsByRoomIdAndDate(id, date);
    const availableSlots = getAvailableSlots(room, bookings);
    return { availableSlots };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to retrieve booking by ID", 500);
  }
};

export const getBookingByRoomIdAndDateService = async (
  roomId: string,
  date: string
) => {
  try {
    if (!roomId || !date) {
      throw new CustomError("Room ID and date are required", 400);
    }
    const bookings = await bookingRepo.findBookingsByRoomIdAndDate(
      roomId,
      date
    );
    return bookings;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(
      "Failed to retrieve bookings by room ID and date",
      500
    );
  }
};

export const getBookingsByUserIdService = async (userId: string) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const bookings = await bookingRepo.findBookingsByUserId(userId);
    if (!bookings || bookings.length === 0) {
      throw new CustomError("No bookings found for the specified user", 404);
    }
    return bookings;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to retrieve bookings by user ID", 500);
  }
};

export const createBookingService = async (
  bookingData: BookingInterface
): Promise<BookingInterface> => {
  try {
    const { error } = createBookingValidator(bookingData);
    if (error) {
      throw new CustomError(error.message, 400);
    }

    const room = await roomRepo.findRoomById(bookingData.roomId);
    if (!room) {
      throw new CustomError("Room not found", 404);
    }

    const user = await userRepo.findUserById(bookingData.userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const date = bookingData.date;
    const roomId = bookingData.roomId;
    const bookings = await bookingRepo.findBookingsByRoomIdAndDate(
      roomId,
      date
    );
    if (!isSlotAvailable(room, bookings, bookingData.time)) {
      throw new CustomError("Requested time slot is not available", 409);
    }
    bookingData.status = "pending";
    const newBooking = await bookingRepo.createBooking(bookingData);
    LogService.logActivity(
      user.id,
      "booking",
      "Criação de agendamento",
      `Booking created for room ${room.number} on ${date} at ${bookingData.time}`,
      undefined
    );
    return newBooking;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to create booking", 500);
  }
};

export const cancellationBookingService = async (
  bookingId: string,
  userId: string
): Promise<{ status: string }> => {
  try {
    if (!bookingId) {
      throw new CustomError("Booking ID is required", 400);
    }

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const user = await userRepo.findUserById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const booking = await bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new CustomError("Booking not found", 404);
    }
    if (user.role === "user" && booking.userId !== userId) {
      throw new CustomError(
        "You do not have permission to cancel this booking",
        403
      );
    }
    if (booking.status === "cancelled") {
      throw new CustomError("Booking is already cancelled", 400);
    }
    booking.status = "cancelled";
    await bookingRepo.updateBooking(bookingId, booking);
    LogService.logActivity(
      booking.userId,
      "booking",
      "Cancelamento de agendamento",
      `Booking with ID ${bookingId} has been canceled`,
      undefined
    );
    return { status: "cancelled" };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to cancel booking", 500);
  }
};

export const confirmBookingService = async (
  bookingId: string
): Promise<{ status: string }> => {
  try {
    if (!bookingId) {
      throw new CustomError("Booking ID is required", 400);
    }

    const booking = await bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new CustomError("Booking not found", 404);
    }
    if (booking.status !== "pending") {
      throw new CustomError("Booking is not in pending status", 400);
    }
    booking.status = "confirmed";
    const updatedBooking = await bookingRepo.updateBooking(bookingId, booking);
    LogService.logActivity(
      booking.userId,
      "booking",
      "Confirmação de agendamento",
      `Booking with ID ${bookingId} has been confirmed`,
      undefined
    );
    if (!updatedBooking) {
      throw new CustomError("Failed to update booking status", 500);
    }
    return { status: "confirmed" };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to confirm booking", 500);
  }
};
