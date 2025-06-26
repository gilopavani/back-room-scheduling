import { hash } from "bcrypt";
import { EditUser } from "../../interfaces/User.interface";
import userRepo from "../../modules/user/user.repo";
import { CustomError } from "../../utils/custom-error";
import LogService from "../log/log.service";

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
    if (userData.password && userData.password.length < 6) {
      throw new CustomError("Password must be at least 6 characters long", 400);
    }
    const passwordHash = await hash(userData.password, 10);
    userData.password = passwordHash;
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
    throw new CustomError("Failed to update user profile", 500);
  }
};
