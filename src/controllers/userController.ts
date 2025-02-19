import { Request, Response } from "express";
import User from "../models/userModel";
import sendResponse from "../helper/sendResponse";
import { redis } from "..";

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
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to get users",
      null,
      error.message,
    );
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
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to get user",
      null,
      error.message,
    );
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
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to update user",
      null,
      error.message,
    );
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
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to delete user",
      null,
      error.message,
    );
  }
};

const userController = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

export default userController;
