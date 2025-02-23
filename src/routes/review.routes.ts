import { Router } from "express";
import reviewController from "../controllers/review.controller";
import auth from "../middleware/auth";
import { USER_ROLE } from "../models/user.model";

const router = Router();

router
  .route("/")
  .post(auth(USER_ROLE.BUYER), reviewController.createReview)
  .get(reviewController.getReviews);

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReviewById)
  .delete(reviewController.deleteReviewById);

export const reviewRoutes = router;
