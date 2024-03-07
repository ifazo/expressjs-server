import { Router } from "express";
import { categoryController } from "../controllers/category.controller";

const router = Router();

router
  .route("/")
  .post(categoryController.postCategory)
  .get(categoryController.getCategories);

export const categoryRoutes = router;
