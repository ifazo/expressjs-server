import { Router } from "express";
import productController from "../controllers/productController";
import auth from "../middleware/auth";
import { ROLE } from "../models/userModel";

const router = Router();

router
  .route("/")
  .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), productController.createProduct)
  .get(productController.getProducts);

router.get("/random", productController.getRandomProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), productController.updateProduct)
  .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), productController.deleteProduct);

export const productRoutes = router;
