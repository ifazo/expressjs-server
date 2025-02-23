import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import { JwtPayload, Secret, sign } from "jsonwebtoken";
import sendResponse from "../middleware/sendResponse";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const data: IUser = req.body;
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return sendResponse(res, 400, false, "User already exists");
    }
    const saltRounds = 13;
    const hashedPassword = await bcrypt.hash(data.password, Number(saltRounds));
    const result = { ...data, password: hashedPassword };
    const user = await User.create(result);
    return sendResponse(res, 201, true, "User created successfully", user);
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const signInUser = async (req: Request, res: Response) => {
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
  } catch (error) {
    return sendResponse(res, 500, false, error);
  }
};

const authController = {
  signUpUser,
  signInUser
};

export default authController;
