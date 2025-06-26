import { SignUp, Auth } from "../../interfaces/Auth.interface";
import { CustomError } from "../../utils/custom-error";
import config from "../../config/config";
import { compareSync, hash } from "bcrypt";
import authRepo from "../../modules/auth/auth.repo";
import {
  validateSignIn,
  validateSignUp,
} from "../../modules/auth/auth.validator";
import { generateJWT } from "../../middlewares/jwt.service";
import LogService from "../log/log.service";

export const signUpService = async (userData: SignUp) => {
  const { error } = validateSignUp(userData);
  if (error) {
    throw new CustomError(error.message, 400);
  }

  const existingUser = await authRepo.findUserByEmail(userData.user.email);
  if (existingUser) {
    throw new CustomError("User already exists", 409);
  }

  if (userData.password && userData.password.length < 6) {
    throw new CustomError("Password must be at least 6 characters long", 400);
  }

  const passwordHash = await hash(userData.password, 10);
  userData.user.role = "user";
  const newUser = await authRepo.createUser(userData, passwordHash);
  if (!newUser) {
    throw new CustomError("User creation failed", 500);
  }
  const payload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    canViewLogs: newUser.canViewLogs,
    canManageScheduling: newUser.canManageScheduling,
  };
  LogService.logActivity(
    newUser.id,
    "account",
    "Criar conta",
    `User ${newUser.email} signed up successfully`,
    undefined
  );
  const accessToken = await generateJWT(
    payload,
    config.JWT_ACCESS_TOKEN_SECRET as string
  );
  return { accessToken };
};

export const signInService = async (userData: Auth) => {
  const { error } = validateSignIn(userData);
  if (error) {
    throw new CustomError(error.message, 400);
  }

  const user = await authRepo.findUserByEmail(userData.email);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const userPassword = await authRepo.getUserPassword(user.id);
  if (!userPassword) {
    throw new CustomError("User password not found", 404);
  }
  const isPasswordValid = compareSync(
    userData.password,
    userPassword.passwordHash
  );
  if (!isPasswordValid) {
    throw new CustomError("Email or password is invalid", 401);
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    canViewLogs: user.canViewLogs,
    canManageScheduling: user.canManageScheduling,
  };

  LogService.logActivity(
    user.id,
    "account",
    "Login",
    `User ${user.email} signed in successfully`,
    undefined
  );

  const accessToken = await generateJWT(
    payload,
    config.JWT_ACCESS_TOKEN_SECRET as string
  );

  return { accessToken };
};
