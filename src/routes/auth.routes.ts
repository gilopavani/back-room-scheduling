import express from "express";
import {
  singUpController,
  signInController,
} from "../controllers/auth/auth.controller";

const router = express.Router();

router.post("/signup", singUpController);
router.post("/signin", signInController);
router.post("/signout", (req, res) => {
  // Implement signout logic here
  res.status(200).json({ message: "Successfully signed out" });
});

export default router;
