import express from "express";
import {
  singUpController,
  signInController,
  signInAdminController,
  checkMailExistsController,
} from "../controllers/auth/auth.controller";

const router = express.Router();

router.post("/signup", singUpController);
router.post("/signin", signInController);
router.post("/admin", signInAdminController);
router.post("/check-mail", checkMailExistsController);
router.post("/signout", (req, res) => {
  res.status(200).json({ message: "Successfully signed out" });
});

export default router;
