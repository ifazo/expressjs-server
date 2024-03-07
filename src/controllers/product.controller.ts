import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import Product, { IProduct } from "../models/product.model";

const createProduct = async (req: Request, res: Response) => {
  try {
    const data: IProduct = req.body;
    const product = await Product.create(data);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to create product",
      data: null,
    });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    if (category) {
      const products = await Product.find({ category: category });
      return res.status(200).json({
        success: true,
        message: "Products by category retrieved successfully",
        data: products,
      });
    }
    else {
      const products = await Product.find();
      res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      data: null,
    });
  }
};

const getRandomProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 6 } }]);
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      data: null,
    });
  }
}

const getProduct = async (req: Request, res: Response) => {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to retrieve product",
      data: null,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const token = req.headers.authorization as string;
    const verifyToken: JwtPayload = verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
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
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to update cow",
      data: null,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const token = req.headers.authorization as string;
    const decoded: JwtPayload = verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    const userId = decoded?.id;
    if (!userId) {
      res.status(404).json({
        success: false,
        message: "You are not authorized to delete this cow",
      });
    }
    const deleteProduct = await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Cow deleted successfully",
      data: deleteProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete cow",
      data: null,
    });
  }
};

export const productController = {
  createProduct,
  getProducts,
  getRandomProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
