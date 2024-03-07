import { Router } from "express";
import { productController } from "../controllers/product.controller";

const router = Router();

router
  .route("/")
  .post(productController.createProduct)
  .get(productController.getProducts);

router.get("/random", productController.getRandomProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export const productRoutes = router;
