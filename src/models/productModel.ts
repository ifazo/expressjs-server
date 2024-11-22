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
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoryId: { type: SchemaTypes.ObjectId, ref: "Category" },
  },
  { timestamps: true },
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
