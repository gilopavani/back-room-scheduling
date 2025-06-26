import { z } from "zod/v4";
import { RoomInterface } from "../../interfaces/room.interface";

export const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timeBlock: z.number().int().positive("Time block must be a positive integer"),
});

export const createRoomValidator = (data: RoomInterface) => {
  return roomSchema.safeParse(data);
};
export const updateRoomValidator = (data: Partial<RoomInterface>) => {
  return roomSchema.partial().safeParse(data);
};
