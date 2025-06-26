import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import meRoutes from "./me.routes";
import roomRoutes from "./room.routes";
import bookingRoutes from "./booking.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/me", meRoutes);
router.use("/room", roomRoutes);
router.use("/booking", bookingRoutes);

export default router;
