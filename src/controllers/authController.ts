import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import sendResponse from "../helper/sendResponse";

const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, "User already exists");
    }
    const saltRounds = 13;
    const hashedPassword = await bcrypt.hash(password, Number(saltRounds));
    const data = { ...req.body, email, password: hashedPassword };
    const user = await User.create(data);
    return sendResponse(res, 201, true, "User created successfully", user);
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to create user",
      null,
      error.message,
    );
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    } as JwtPayload;
    const secret = process.env.JWT_SECRET_KEY as Secret;
    const token = sign(payload, secret, { expiresIn: "1d" });
    return sendResponse(res, 200, true, "User logged in successfully", {
      token,
    });
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to login",
      null,
      error.message,
    );
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(
        res,
        401,
        false,
        "Authorization token is missing or invalid",
      );
    }
    const token = authHeader.split(" ")[1];
    let decodedToken: JwtPayload;
    try {
      decodedToken = verify(
        token,
        process.env.JWT_SECRET_KEY as Secret,
      ) as JwtPayload;
    } catch (err) {
      return sendResponse(res, 401, false, "Invalid or expired token");
    }
    const userId = decodedToken?.id;
    const profile = await User.findById(userId);
    if (!profile) {
      return sendResponse(res, 404, false, "Profile not found");
    }
    return sendResponse(res, 200, true, "Get profile successfully", profile);
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to get profile",
      null,
      error.message,
    );
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(
        res,
        401,
        false,
        "Authorization token is missing or invalid",
      );
    }
    const token = authHeader.split(" ")[1];
    let decodedToken: JwtPayload;
    try {
      decodedToken = verify(
        token,
        process.env.JWT_SECRET_KEY as Secret,
      ) as JwtPayload;
    } catch (err) {
      return sendResponse(res, 401, false, "Invalid or expired token");
    }
    const userId = decodedToken?.id;
    const profile = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!profile) {
      return sendResponse(res, 404, false, "Profile not found");
    }
    return sendResponse(
      res,
      200,
      true,
      "Profile updated successfully",
      profile,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to update profile",
      null,
      error.message,
    );
  }
};

const deleteProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(
        res,
        401,
        false,
        "Authorization token is missing or invalid",
      );
    }
    const token = authHeader.split(" ")[1];
    let decodedToken: JwtPayload;
    try {
      decodedToken = verify(
        token,
        process.env.JWT_SECRET_KEY as Secret,
      ) as JwtPayload;
    } catch (err) {
      return sendResponse(res, 401, false, "Invalid or expired token");
    }
    const userId = decodedToken?.id;
    const profile = await User.findByIdAndDelete(userId);
    if (!profile) {
      return sendResponse(res, 404, false, "Profile not found");
    }
    return sendResponse(
      res,
      200,
      true,
      "Profile deleted successfully",
      profile,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to delete profile",
      null,
      error.message,
    );
  }
};

const authController = {
  signUp,
  signIn,
  getProfile,
  updateProfile,
  deleteProfile,
};

export default authController;
