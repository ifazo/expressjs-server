import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "../config";
import User from "../models/userModel";
import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";

const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with the same phone number already exists");
    }
    const saltRounds = config.salt_rounds || 10;
    const hashedPassword = await bcrypt.hash(password, Number(saltRounds));
    const data = { name, email, password: hashedPassword };
    const user = await User.create(data);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      errorMessages: error.message,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    } as JwtPayload;
    const secret = config.jwt_secret_key as Secret;
    const accessToken = sign(payload, secret, {
      expiresIn: "1d",
    });
    const refreshToken = sign(payload, secret, {
      expiresIn: "365d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: {
        accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to log in",
      error: error.message,
    });
  }
};

const token = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }
    const decodedToken = verify(refreshToken, config.jwt_secret_key as Secret) as JwtPayload;
    const { id, email, role } = decodedToken;
    const payload = { id, email, role } as JwtPayload;
    const secret = config.jwt_secret_key as Secret;
    const accessToken = sign(payload, secret, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Refresh token generated successfully",
      data: {
        accessToken,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get refresh token",
      error: error.message,
    });
  }
};

export const authController = {
  signUp,
  signIn,
  token,
};
