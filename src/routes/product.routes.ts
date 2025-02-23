import { Router } from "express";
import productController from "../controllers/product.controller";
import auth from "../middleware/auth";
import { USER_ROLE } from "../models/user.model";

const router = Router();

router
  .route("/")
  .post(auth(USER_ROLE.SELLER), productController.createProduct)
  .get(productController.getProducts);

router.get("/random", productController.getRandomProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(auth(USER_ROLE.SELLER), productController.updateProductById)
  .delete(auth(USER_ROLE.SELLER), productController.deleteProductById);

export const productRoutes = router;
