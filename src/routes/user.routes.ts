import { Router } from "express";
import userController from "../controllers/user.controller";
import auth from "../middleware/auth";
import { ROLE } from "../models/user.model";

const router = Router();

router
  .route("/:id")
  .get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getUser)
  .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.updateUser)
  .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.deleteUser);

router
  .route("/")
  .get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getUsers);

export const userRoutes = router;
