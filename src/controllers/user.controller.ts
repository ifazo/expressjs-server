import { Request, Response } from "express";
import User from "../models/user.model";
import { redis } from "..";
import sendResponse from "../middleware/sendResponse";

const getUsers = async (_req: Request, res: Response) => {
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
    const result = await User.find();
    await redis.set("users", JSON.stringify(result));
    return sendResponse(res, 200, true, "Get users successfully", result);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    const result = await User.findById(id);
    if (!result) {
      return sendResponse(res, 404, false, "User not found");
    }
    await redis.set(`user:${id}`, JSON.stringify(result));
    return sendResponse(res, 200, true, "Get user successfully", result);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
  getUser,
  updateUser,
  deleteUser,
};

export default userController;
