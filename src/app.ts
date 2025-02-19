import express, { Application, Request, Response } from "express";
import cors from "cors";
import { authRoutes } from "./views/authRoutes";
import { userRoutes } from "./views/userRoutes";
import { productRoutes } from "./views/productRoutes";
import { categoryRoutes } from "./views/categoryRoutes";
import { reviewRoutes } from "./views/reviewRoutes";
import { redis } from ".";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Expressjs Server!");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("Server api is running successfully!");
});

app.get("/redis", async (_req, res) => {
  await redis.set("key", "Hello from Redis");
  const value = await redis.get("key");
  res.json({
    message: "Redis test",
    value,
  });
});