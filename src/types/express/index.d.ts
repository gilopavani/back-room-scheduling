import { JwtPayload } from "jsonwebtoken";
import { User } from "../../database/models/User";

declare module "express-serve-static-core" {
  interface Request {
    context?: JwtPayload;
    user?: User;
  }
}
