import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Product from "../models/productModel";

const postCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    return res.status(200).send({
      success: true,
      statusCode: 201,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
      data: null,
    });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    return res.status(200).send({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (err) {
    
    return res.status(500).send({
      success: false,
      message: err,
      data: [],
    });
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Product.find({ categoryId: id })

    return res.status(200).send({
      success: true,
      message: "Product by category retrieved successfully",
      data: category,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err,
      data: null,
    });
  }
}

const categoryController = {
  postCategory,
  getCategories,
  getProductByCategory,
};

export default categoryController;