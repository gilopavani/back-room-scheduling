import { NextFunction, Request, Response } from "express";
import {
  getAllBookingsService,
  getBookingByRoomIdAndDateService,
  createBookingService,
  getBookingsByUserIdService,
  getFreeBookingByRoomIdandDateService,
} from "../../services/booking/booking.service";

export const getAllBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await getAllBookingsService();
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getFreeBookingByRoomIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const availableSlots = await getFreeBookingByRoomIdandDateService(id, date);
    res.status(200).json(availableSlots);
  } catch (error) {
    next(error);
  }
};

export const getBookingByRoomIdAndDateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomId } = req.params;
    const { date } = req.body;
    const bookings = await getBookingByRoomIdAndDateService(roomId, date);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingData = req.body;
    const newBooking = await createBookingService(bookingData);
    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const bookings = await getBookingsByUserIdService(userId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
