import { Request, Response } from "express";
import Review, { IReview } from "../models/reviewModel";

const createReview = async (req: Request, res: Response) => {
    try {
        const data: IReview = req.body;
        const review = await Review.create(data);

        return res.status(200).send({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err,
            data: null,
        });
    }
}

const getReviews = async (req: Request, res: Response) => {
    try {
        const productId = req.query.productId as string;
        if (productId) {
            const reviews = await Review.find({ productId: productId });
            return res.status(200).send({
                success: true,
                message: "Reviews by product retrieved successfully",
                data: reviews,
            });
        }
        else {
            return res.status(404).send({
                success: false,
                message: "Invalid product id",
                data: null,
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err,
            data: null,
        });
    }
}

const reviewController = {
    createReview,
    getReviews,
};

export default reviewController;