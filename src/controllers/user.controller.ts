import { Request, Response } from "express";
import User from "../models/user.model";
import { redis } from "..";
import sendResponse from "../middleware/sendResponse";
import verifyToken from "../middleware/verifyToken";

const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    if (role) {
      const users = await User.find({ role: role })
        .select("-password")
        .sort({ createdAt: -1 });
      return sendResponse(res, 200, true, "Get users successfully", users);
    }
    const cachedUsers = await redis.get("users");
    if (cachedUsers) {
      return sendResponse(
        res,
        200,
        true,
        "Get users from redis cache",
        JSON.parse(cachedUsers),
      );
    }
    const user = await User.find().select("-password").sort({ createdAt: -1 });
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
        "Get user from redis cache",
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
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

export default userController;
