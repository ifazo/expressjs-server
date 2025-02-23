import { ObjectId, Schema, SchemaTypes, model } from "mongoose";

export interface IProduct {
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  categoryId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      min: 0,
      get: (v: number) => parseFloat(v.toFixed(2)),
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      get: (v: number) => parseFloat(v.toFixed(1)),
      required: true,
    },
    stock: { type: Number, integer: true, required: true },
    categoryId: { type: SchemaTypes.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true },
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
