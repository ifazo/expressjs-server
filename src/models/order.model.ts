import { ObjectId, Schema, SchemaTypes, model } from "mongoose";
import { IProduct } from "./product.model";

export interface IOrderProduct extends IProduct {
  quantity: number;
}
export interface IOrder {
  products: Array<IOrderProduct>;
  total: number;
  status: string;
  sessionId: string;
  userId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema: Schema = new Schema<IOrder>(
  {
    products: { type: [{ type: SchemaTypes.Mixed }], required: true },
    total: {
      type: Number,
      min: 0,
      get: (v: number) => parseFloat(v.toFixed(2)),
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    sessionId: { type: String, required: true },
    userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Order = model<IOrder>("Order", orderSchema);

export default Order;
