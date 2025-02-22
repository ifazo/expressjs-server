import { Router } from "express";
import categoryController from "../controllers/category.controller";
import auth from "../middleware/auth";
import { ROLE } from "../models/user.model";

const router = Router();

router
  .route("/")
  .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), categoryController.postCategory)
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(categoryController.getProductsByCategory)
  .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), categoryController.updateCategory)
  .delete(
    auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
    categoryController.deleteCategory,
  );

export const categoryRoutes = router;
