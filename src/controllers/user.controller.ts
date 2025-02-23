import { Request, Response } from "express";
import User from "../models/user.model";
import { redis } from "..";
import sendResponse from "../middleware/sendResponse";
import verifyToken from "../middleware/verifyToken";

const getUserByIds = async (_req: Request, res: Response) => {
  try {
    const cachedUsers = await redis.get("users");
    if (cachedUsers) {
      return sendResponse(
        res,
        200,
        true,
        "Get users successfully",
        JSON.parse(cachedUsers),
      );
    }
    const user = await User.find();
    await redis.set("users", JSON.stringify(user));
    return sendResponse(res, 200, true, "Get users successfully", user);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, false, "Invalid token");
    }
    const decodedToken = verifyToken(authHeader);
    if (!decodedToken) {
      return sendResponse(res, 401, false, "You are unauthorized");
    }
    if (decodedToken.id !== id) {
      return sendResponse(res, 401, false, "You are not owner");
    }
    const cachedUser = await redis.get(`user:${id}`);
    if (cachedUser) {
      return sendResponse(
        res,
        200,
        true,
        "Get user successfully",
        JSON.parse(cachedUser),
      );
    }
    const user = await User.findById(id);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    await redis.set(`user:${id}`, JSON.stringify(user));
    return sendResponse(res, 200, true, "Get user successfully", user);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, false, "Invalid token");
    }
    const decodedToken = verifyToken(authHeader);
    if (!decodedToken) {
      return sendResponse(res, 401, false, "You are unauthorized");
    }
    if (decodedToken.id !== id) {
      return sendResponse(res, 401, false, "You are not owner");
    }
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    await redis.del(`user:${id}`);
    await redis.del("users");
    return sendResponse(res, 200, true, "User updated successfully", user);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 401, false, "Invalid token");
    }
    const decodedToken = verifyToken(authHeader);
    if (!decodedToken) {
      return sendResponse(res, 401, false, "You are unauthorized");
    }
    if (decodedToken.id !== id) {
      return sendResponse(res, 401, false, "You are not owner");
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    await redis.del(`user:${id}`);
    await redis.del("users");
    return sendResponse(res, 200, true, "User deleted successfully", user);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const userController = {
  getUserByIds,
  getUserById,
  updateUserById,
  deleteUserById,
};

export default userController;
