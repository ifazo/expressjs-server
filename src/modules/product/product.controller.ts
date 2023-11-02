import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "../../helpers/jwtHelpers";
import Product from "./product.model";
import IProduct from "./product.interface";

const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Product.create(data);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Cow created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to create cow",
      errorMessages: error.message,
    });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      message: "Cows retrieved successfully",
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cows",
      errorMessages: error.message,
    });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to retrieve product",
      errorMessages: error.message,
    });
  }
};

const updateProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const token = req.headers.authorization as string;
    const verifyToken: JwtPayload = verifyJwt(token);
    const userId = verifyToken?.id;
    if (!userId) {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: "You are not authorized to update this cow",
      });
    }
    const updatedData: IProduct = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cow updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to update cow",
      errorMessages: error.message,
    });
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const token = req.headers.authorization as string;
    const decoded: JwtPayload = verifyJwt(token);
    const userId = decoded?.id;
    if (!userId) {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: "You are not authorized to delete this cow",
      });
    }
    const deleteProduct = await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cow deleted successfully",
      data: deleteProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to delete cow",
      errorMessages: error.message,
    });
  }
};

export const productController = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
