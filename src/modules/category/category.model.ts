import { Schema, model } from "mongoose";

interface ICategory {
  name: string;
  image: string;
  details: string;
  date: Date;
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Category = model<ICategory>("Category", categorySchema);
export default Category;