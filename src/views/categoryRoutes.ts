import { Router } from "express";
import categoryController from "../controllers/categoryController";
import auth from "../middleware/auth";
import { ROLE } from "../models/userModel";

const router = Router();

router
  .route("/")
  .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), categoryController.postCategory)
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(categoryController.getProductsByCategory)
  .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), categoryController.updateCategory)
  .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
