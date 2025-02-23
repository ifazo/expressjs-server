import { Router } from "express";
import categoryController from "../controllers/category.controller";
import auth from "../middleware/auth";
import { USER_ROLE } from "../models/user.model";

const router = Router();

router
  .route("/")
  .post(auth(USER_ROLE.ADMIN), categoryController.postCategory)
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .patch(auth(USER_ROLE.ADMIN), categoryController.updateCategoryById)
  .delete(auth(USER_ROLE.ADMIN), categoryController.deleteCategoryById);

export const categoryRoutes = router;
