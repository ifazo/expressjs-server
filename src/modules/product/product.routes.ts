import { Router } from "express";
import { productController } from "./product.controller";

const router = Router();

router
  .route("/")
  .post( productController.createProduct)
  .get( productController.getProducts);
router
  .route("/:id")
  .get( productController.getProduct)
  .patch( productController.updateProduct)
  .delete( productController.deleteProduct);

export const productRoutes = router;
