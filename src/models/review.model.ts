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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      get: (v: number) => parseFloat(v.toFixed(2)),
      required: true,
    },
    review: { type: String, required: true },
    userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    productId: { type: SchemaTypes.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true },
);

const Review = model<IReview>("Review", reviewSchema);

export default Review;
