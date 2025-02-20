import { Request, Response } from "express";
import Review, { IReview } from "../models/reviewModel";
import sendResponse from "../helper/sendResponse";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "..";

const createReview = async (req: Request, res: Response) => {
  try {
    const data: IReview = req.body;
    const review = await Review.create(data);
    await redis.del(`reviews:${data.productId}`);
    return sendResponse(res, 201, true, "Review created successfully", review);
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to create review",
      null,
      error.message,
    );
  }
};

const getProductReviews = async (req: Request, res: Response) => {
  try {
    const id = req.query.productId as string;
    if (!id) {
      return sendResponse(res, 400, false, "Product ID is required");
    }
    const cachedReviews = await redis.get(`reviews:${id}`);
    if (cachedReviews) {
      return sendResponse(
        res,
        200,
        true,
        "Reviews retrieved successfully",
        JSON.parse(cachedReviews),
      );
    }
    const reviews = await Review.find({ productId: id });
    await redis.set(`reviews:${id}`, JSON.stringify(reviews));
    return sendResponse(
      res,
      200,
      true,
      "Reviews retrieved successfully",
      reviews,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to get reviews",
      null,
      error.message,
    );
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, false, "You are unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET_KEY as Secret;
    const decodedToken = jwt.verify(token, secret) as JwtPayload;
    const userId = decodedToken?.id;
    const review = await Review.findById(id);
    if (!review) {
      return sendResponse(res, 404, false, "Review not found");
    }

    if (review.userId.toString() !== userId) {
      return sendResponse(
        res,
        403,
        false,
        "Only the owner can edit this review",
      );
    }
    const updatedReview = await Review.findByIdAndUpdate(id, data, {
      new: true,
    });
    await redis.del(`reviews:${review.productId}`);
    return sendResponse(
      res,
      200,
      true,
      "Review updated successfully",
      updatedReview,
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to update review",
      null,
      error,
    );
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, false, "You are unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET_KEY as Secret;
    const decodedToken = jwt.verify(token, secret) as JwtPayload;
    const userId = decodedToken?.id;
    const review = await Review.findById(id);
    if (!review) {
      return sendResponse(res, 404, false, "Review not found");
    }

    if (review.userId.toString() !== userId) {
      return sendResponse(
        res,
        403,
        false,
        "Only the owner can edit this review",
      );
    }
    const deletedReview = await Review.findByIdAndDelete(id);
    await redis.del(`reviews:${review.productId}`);
    return sendResponse(
      res,
      200,
      true,
      "Review deleted successfully",
      deletedReview,
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to delete review",
      null,
      error,
    );
  }
};

const reviewController = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};

export default reviewController;
