import { ObjectId, Schema, SchemaTypes, model } from "mongoose";

export interface IReview {
  name: string;
  rating: number;
  review: string;
  userId: ObjectId;
  productId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema: Schema = new Schema<IReview>(
  {
    rating: { type: Number, required: true, min: 1, max: 5, get: (v: number) => parseFloat(v.toFixed(2)) },
    review: { type: String, required: true },
    userId: { type: SchemaTypes.ObjectId, ref: "User" },
    productId: { type: SchemaTypes.ObjectId, ref: "Product" },
  },
  { timestamps: true },
);

const Review = model<IReview>("Review", reviewSchema);

export default Review;
