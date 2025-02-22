import { Router } from "express";
import reviewController from "../controllers/review.controller";

const router = Router();

router
  .route("/")
  .post(reviewController.createReview)
  .get(reviewController.getProductReviews);

router
  .route("/:id")
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export const reviewRoutes = router;
