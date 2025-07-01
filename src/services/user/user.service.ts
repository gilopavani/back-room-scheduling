import userRepo from "../../modules/user/user.repo";
import { validatePermission } from "../../modules/user/user.validator";
import { CustomError } from "../../utils/custom-error";
import {
  PaginationParams,
  FilterParams,
  createPaginationResult,
} from "../../utils/pagination";

export const getAllUsersService = async (
  paginationParams: PaginationParams,
  filterParams: FilterParams
) => {
  try {
    const users = await userRepo.getAllUsersWithPagination(
      paginationParams,
      filterParams
    );
    return users;
  } catch (error) {
    throw new CustomError("Failed to retrieve users", 500);
  }
};

export const getUserByIdService = async (userId: string) => {
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
    throw new CustomError("Failed to retrieve user", 500);
  }
};

export const getUserPermissionsService = async (userId: string) => {
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

export const updateUserPermissionsService = async (
  userId: string,
  permissions: {
    canViewLogs?: boolean;
    canManageScheduling?: boolean;
  }
) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const { error } = validatePermission({ permissions });
    if (error) {
      throw new CustomError(error.message, 400);
    }
    const updatedUser = await userRepo.editUserPermissions(userId, permissions);
    if (!updatedUser) {
      throw new CustomError("Failed to update user permissions", 404);
    }
    return updatedUser;
  } catch (error) {
    throw new CustomError("Failed to update user permissions", 500);
  }
};

export const changeUserStatusService = async (
  userId: string,
  status: "active" | "inactive"
) => {
  try {
    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }
    const updatedUser = await userRepo.changeUserStatus(userId, status);
    if (!updatedUser) {
      throw new CustomError("Failed to change user status", 404);
    }
    return updatedUser;
  } catch (error) {
    throw new CustomError("Failed to change user status", 500);
  }
};
