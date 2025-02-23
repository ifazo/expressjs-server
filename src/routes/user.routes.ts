import { Router } from "express";
import userController from "../controllers/user.controller";
import auth from "../middleware/auth";
import { USER_ROLE } from "../models/user.model";

const router = Router();

router.route("/").get(auth(USER_ROLE.ADMIN), userController.getUserByIds);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

export const userRoutes = router;
