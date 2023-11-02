import { Schema, model } from "mongoose";
import ICategory from "./category.interface";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Category = model<ICategory>("Category", categorySchema);
export default Category;