import express from "express";
import { authController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/token", authController.token);

export const authRoutes = router;
