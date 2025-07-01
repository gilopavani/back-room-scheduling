import { NextFunction, Request, Response } from "express";
import {
  signUpService,
  signInService,
  signInServiceAdmin,
  checkMailExistsService,
} from "../../services/auth/auth.service";

export const singUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body;

    const response = await signUpService(userData);
    res.status(201).json({
      message: "Successfully signed up",
      accessToken: response.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userData = { email, password };
    const response = await signInService(userData);
    res.status(200).json({
      message: "Successfully signed in",
      accessToken: response.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signInAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userData = { email, password };
    const response = await signInServiceAdmin(userData);
    res.status(200).json({
      message: "Successfully signed in as admin",
      accessToken: response.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const checkMailExistsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const response = await checkMailExistsService(email);
    res.status(200).json({
      message: "Email exists",
      exists: response.exists,
    });
  } catch (error) {
    next(error);
  }
};
