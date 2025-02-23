import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";

const router = Router();

router.route("/").post(paymentController.createPayment);

export const paymentRoutes = router;
