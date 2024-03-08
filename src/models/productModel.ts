import { ObjectId, Schema, SchemaTypes, model } from "mongoose";

export interface IProduct {
  name: string;
  image: string;
  categoryId: ObjectId;
  price: string;
  status: string;
  rating: number;
  description: string;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  categoryId: { type: SchemaTypes.ObjectId, ref: "Category" },
  price: { type: String, required: true },
  status: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  features: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = model<IProduct>("Product", productSchema);

export default Product;
