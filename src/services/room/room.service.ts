import { CustomError } from "../../utils/custom-error";
import roomRepo from "../../modules/room/room.repo";
import { RoomInterface } from "../../interfaces/room.interface";
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

    const updatedRoom = await roomRepo.updateRoom(roomId, roomData);
    if (!updatedRoom) {
      throw new CustomError("Room not found or failed to update", 404);
    }
    return updatedRoom;
  } catch (error) {
    throw new CustomError("Failed to update room", 500);
  }
};
