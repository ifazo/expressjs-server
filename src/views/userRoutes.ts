import { Router } from "express";
import { userController } from "../controllers/userController";
import auth from "../middleware/auth";
import { ROLE } from "../models/userModel";

const router = Router();

router.get(
  "/profile",
  auth(ROLE.BUYER, ROLE.SELLER),
  userController.getProfile
).patch("/profile", auth(ROLE.BUYER, ROLE.SELLER), userController.updateProfile);
router
  .get("/:id", auth(ROLE.ADMIN), userController.getUser)
  .patch("/:id", auth(ROLE.ADMIN), userController.updateUser)
  .delete("/:id", auth(ROLE.ADMIN), userController.deleteUser);
router.get("/", auth(ROLE.ADMIN), userController.getUsers);

export const userRoutes = router;
