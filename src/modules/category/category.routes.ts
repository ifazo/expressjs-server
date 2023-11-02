import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router
  .route("/")
  .post(categoryController.postCategory)
  .get(categoryController.getCategories);

router.route("/:id").get(categoryController.getCategory);

export const categoryRoutes = router;
