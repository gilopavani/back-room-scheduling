import { hash } from "bcrypt";
import { EditUser } from "../../interfaces/User.interface";
import userRepo from "../../modules/user/user.repo";
import { CustomError } from "../../utils/custom-error";
import LogService from "../log/log.service";
import bookingRepo from "../../modules/booking/booking.repo";
import logRepo from "../../modules/logs/logs.repo";
import { PaginationParams, FilterParams } from "../../utils/pagination";

export const getProfileService = async (userId: string) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const user = await userRepo.findUserById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  } catch (error) {
    throw new CustomError("Failed to retrieve user profile", 500);
  }
};

export const getPermissionsService = async (userId: string) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const userPermissions = await userRepo.findPermissionsByUserId(userId);
    if (!userPermissions) {
      throw new CustomError("User permissions not found", 404);
    }
    return userPermissions;
  } catch (error) {
    throw new CustomError("Failed to retrieve user permissions", 500);
  }
};

export const updateProfileService = async (
  userId: string,
  userData: EditUser
) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    // Validar se senha foi fornecida e se tem pelo menos 6 caracteres
    if (userData.password && userData.password.trim() !== "") {
      if (userData.password.length < 6) {
        throw new CustomError(
          "Password must be at least 6 characters long",
          400
        );
      }
      // Hash da senha apenas se foi fornecida
      const passwordHash = await hash(userData.password, 10);
      userData.password = passwordHash;
    } else {
      // Remove a senha do objeto se não foi fornecida ou está vazia
      userData.password = "";
    }

    const updatedUser = await userRepo.updateUserProfile(userId, userData);
    if (!updatedUser) {
      throw new CustomError("Failed to update user profile", 404);
    }

    LogService.logActivity(
      userId,
      "account",
      "Atualizar perfil",
      `User ${updatedUser.user.email} updated their profile successfully`
    );
    return updatedUser;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to update user profile", 500);
  }
};

export const getBookingsByUserIdService = async (
  userId: string,
  paginationParams: PaginationParams,
  filterParams: FilterParams
) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const bookings = await bookingRepo.getBookingsByUserIdWithPagination(
      userId,
      paginationParams,
      filterParams
    );
    return bookings;
  } catch (error) {
    throw new CustomError("Failed to retrieve bookings by user ID", 500);
  }
};

export const getLogsByUserIdService = async (
  userId: string,
  paginationParams: PaginationParams,
  filterParams: FilterParams
) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const logs = await logRepo.getLogsByUserIdWithPagination(
      userId,
      paginationParams,
      filterParams
    );
    return logs;
  } catch (error) {
    throw new CustomError("Failed to retrieve user logs", 500);
  }
};
