import { Schema, model } from "mongoose";

export interface ICategory {
  name: string;
  image?: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, unique: true, required: true },
    image: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const Category = model<ICategory>("Category", categorySchema);

export default Category;
