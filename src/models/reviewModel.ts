import { ObjectId, Schema, SchemaTypes, model } from "mongoose";

export interface IReview {
    name: string;
    rating: number;
    comment: string;
    productId: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const reviewSchema: Schema = new Schema<IReview>({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    productId: { type: SchemaTypes.ObjectId, ref: "Product" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Review = model<IReview>("Review", reviewSchema);

export default Review;