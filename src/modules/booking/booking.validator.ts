import { z } from "zod/v4";
import { BookingInterface } from "../../interfaces/Booking.interface";

export const bookingSchema = z.object({
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
  time: z.string().min(1, "Time is required"),
  userId: z.string().min(1, "User ID is required"),
  roomId: z.string().min(1, "Room ID is required"),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
});

export const createBookingValidator = (data: BookingInterface) => {
  return bookingSchema.safeParse(data);
};
