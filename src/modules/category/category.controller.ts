import { Request, Response } from "express";
import Category from "./category.model";

const postCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to create category",
      errorMessages: error.message,
    });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      errorMessages: error.message,
    });
  }
};

const getCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to retrieve category",
      errorMessages: error.message,
    });
  }
};

export const categoryController = {
  postCategory,
  getCategories,
  getCategory,
};
