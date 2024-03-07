import { Router } from "express";
import { categoryController } from "../controllers/categoryController";

const router = Router();

router
  .route("/")
  .post(categoryController.postCategory)
  .get(categoryController.getCategories);

export const categoryRoutes = router;
