import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "../../config";
import User from "../user/user.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { signJwt, verifyJwt } from "../../helpers/jwtHelpers";

const signUp = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const existingUser = await User.findOne({
      email: data.email,
    });
    if (existingUser) {
      throw new Error("User with the same phone number already exists");
    }
    const { password } = data;
    const saltRounds = config.salt_rounds || 10;
    const hashedPassword = await bcrypt.hash(password, Number(saltRounds));
    const newData = { ...data, password: hashedPassword };
    const result = await User.create(newData);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to create user",
      errorMessages: error.message,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const payload = { id: user._id, role: user.role } as JwtPayload;
    const accessToken = signJwt(payload, "1d") as Secret;
    const refreshToken = signJwt(payload, "365d") as Secret;

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
        accessToken: accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to log in",
      error: error.message,
    });
  }
};

const token = async (req: Request, res: Response) => {
  try {
    // const refreshToken = req.cookies.refreshToken;
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Unauthorized",
        data: null,
      });
    }
    const decodedToken = verifyJwt(refreshToken);
    const { id, role } = decodedToken as any;
    const payload = { id, role } as JwtPayload;
    const accessToken = signJwt(payload, "1d");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Refresh token generated successfully",
      data: {
        accessToken: accessToken,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
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
