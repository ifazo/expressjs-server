import { Request, Response } from "express";
import sendResponse from "../middleware/sendResponse";
import Order from "../models/order.model";
import verifyToken from "../middleware/verifyToken";

const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    return sendResponse(
      res,
      200,
      true,
      "Orders retrieved successfully",
      orders,
    );
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, false, "You are unauthorized");
    }
    const decodedToken = verifyToken(authHeader);
    const userId = decodedToken?.id;
    const order = await Order.findById(id).populate("products.product").exec();
    if (!order) {
      return sendResponse(res, 404, false, "Order not found");
    }
    if (order.userId.toString() !== userId) {
      return sendResponse(
        res,
        403,
        false,
        "You are unauthorized to view this order",
      );
    }
    return sendResponse(res, 200, true, "Order retrieved successfully", order);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const orderController = {
  getOrders,
  getOrderById,
};

export default orderController;
