import { NextFunction, Request, Response } from "express";
import {
  getAllBookingsService,
  getBookingByRoomIdAndDateService,
  createBookingService,
  getBookingsByUserIdService,
  getFreeBookingByRoomIdandDateService,
  cancellationBookingService,
  confirmBookingService,
} from "../../services/booking/booking.service";
import { getPaginationParams, getFilterParams } from "../../utils/pagination";

export const getAllBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await getAllBookingsService(paginationParams, filterParams);
    res.status(200).json(result);
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
    const paginationParams = getPaginationParams(req.query);
    const filterParams = getFilterParams(req.query);
    const result = await getBookingsByUserIdService(
      userId,
      paginationParams,
      filterParams
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const cancellationBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const userId = req.context?.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const cancelledBooking = await cancellationBookingService(
      bookingId,
      userId
    );
    res.status(200).json(cancelledBooking);
  } catch (error) {
    next(error);
  }
};

export const confirmBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const confirmedBooking = await confirmBookingService(bookingId);
    res.status(200).json(confirmedBooking);
  } catch (error) {
    next(error);
  }
};
