import { Router } from "express";
import categoryController from "../controllers/categoryController";

const router = Router();

router
  .route("/")
  .post(categoryController.postCategory)
  .get(categoryController.getCategories);

  router.route("/:id").get(categoryController.getProductByCategory);

export const categoryRoutes = router;
