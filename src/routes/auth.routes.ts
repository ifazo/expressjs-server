import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-up", authController.signUpUser);
router.post("/sign-in", authController.signInUser);

export const authRoutes = router;
