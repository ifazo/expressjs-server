import { Router } from "express";
import reviewController from "../controllers/reviewController";

const router = Router();

router
  .route("/")
  .post(reviewController.createReview)
  .get(reviewController.getReviews);