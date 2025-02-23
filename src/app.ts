import express, { Application, Request, Response } from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { productRoutes } from "./routes/product.routes";
import { categoryRoutes } from "./routes/category.routes";
import { reviewRoutes } from "./routes/review.routes";
import { redis } from ".";
import { orderRoutes } from "./routes/order.routes";
import { paymentRoutes } from "./routes/payment.routes";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/reviews", reviewRoutes);
apiRouter.use("/payments", paymentRoutes);
apiRouter.use("/orders", orderRoutes);

app.use("/api", apiRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Expressjs Server!");
});

app.get("/api", (_req: Request, res: Response) => {
  res.send("Server api is running successfully!");
});

app.get("/success", (_req: Request, res: Response) => {
  res.send("Payment successful!");
});

app.get("/cancel", (_req: Request, res: Response) => {
  res.send("Payment cancelled!");
});

app.get("/redis", async (_req, res) => {
  await redis.set("key", "Hello from Redis");
  const value = await redis.get("key");
  res.json({
    message: "Redis test",
    value,
  });
});
