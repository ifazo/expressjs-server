import { Schema, model } from "mongoose";

export interface IProduct {
  name: string;
  image: string;
  category: string;
  price: string;
  status: string;
  rating: number;
  description: string;
  features: Array<string>;
  date: Date;
}

const productSchema: Schema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  features: Array,
  date: { type: Date, default: Date.now },
});

const Product = model<IProduct>("Product", productSchema);
export default Product;
