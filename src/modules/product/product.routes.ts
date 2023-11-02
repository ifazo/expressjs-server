import { Router } from "express";
import { productController } from "./product.controller";

const router = Router();

router
  .route("/")
  .post( productController.createProduct)
  .get( productController.getProducts);
router
  .route("/:id")
  .get( productController.getProductById)
  .patch( productController.updateProductById)
  .delete( productController.deleteProductById);

export const productRoutes = router;
