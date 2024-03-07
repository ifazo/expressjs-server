import { Request, Response } from "express";
import User from "../models/user.model";
import { JwtPayload, verify } from "jsonwebtoken";

const getUsers = async (_req: Request, res: Response) => {
  try {
    const result = await User.find();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to retrieve users",
      errorMessages: error.message,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await User.findById(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to retrieve user",
      errorMessages: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to update user",
      errorMessages: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to delete user",
      errorMessages: error.message,
    });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const decodedToken = verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const userId = decodedToken?.id;
    const profile = await User.findById(userId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Profile not found",
      });
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to get profile",
      errorMessages: error.message,
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const token = req.headers.authorization as string;
    const decodedToken = verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const userId = decodedToken?.id;
    const profile = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!profile) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to get profile",
      errorMessages: error.message,
    });
  }
};

export const userController = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
