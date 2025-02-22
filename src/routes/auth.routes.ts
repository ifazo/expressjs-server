import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router
  .route("/profile")
  .get(authController.getProfile)
  .patch(authController.updateProfile)
  .delete(authController.deleteProfile);

export const authRoutes = router;
