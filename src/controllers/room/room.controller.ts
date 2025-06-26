import { NextFunction, Request, Response } from "express";
import {
  getAllRoomsService,
  getRoomByIdService,
  createRoomService,
  updateRoomService,
} from "../../services/room/room.service";

export const getAllRoomsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rooms = await getAllRoomsService();
    res.status(200).json({ rooms });
  } catch (error) {
    next(error);
  }
};

export const getRoomByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roomId = req.params.roomId;
    const room = await getRoomByIdService(roomId);
    res.status(200).json({ room });
  } catch (error) {
    next(error);
  }
};

export const createRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roomData = req.body;
    const newRoom = await createRoomService(roomData);
    res.status(201).json({ newRoom });
  } catch (error) {
    next(error);
  }
};

export const updateRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roomId = req.params.roomId;
    const roomData = req.body;
    const updatedRoom = await updateRoomService(roomId, roomData);
    res.status(200).json({ updatedRoom });
  } catch (error) {
    next(error);
  }
};
