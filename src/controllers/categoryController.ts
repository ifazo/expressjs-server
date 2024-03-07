import { Request, Response } from "express";
import Category from "../models/categoryModel";

const postCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      data: null,
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
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      data: [],
    });
  }
};

export const categoryController = {
  postCategory,
  getCategories,
};
