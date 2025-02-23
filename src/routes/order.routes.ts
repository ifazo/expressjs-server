import { Router } from "express";
import orderController from "../controllers/order.controller";
import auth from "../middleware/auth";
import { USER_ROLE } from "../models/user.model";

const router = Router();

router.route("/").get(auth(USER_ROLE.ADMIN), orderController.getOrders);

router.route("/:id").get(orderController.getOrderById);

export const orderRoutes = router;
