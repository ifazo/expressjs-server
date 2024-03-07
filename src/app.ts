import express, { Application, Request, Response } from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { productRoutes } from "./routes/product.routes";
import { categoryRoutes } from "./routes/category.routes";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Next.js Server is running successfully");
});
