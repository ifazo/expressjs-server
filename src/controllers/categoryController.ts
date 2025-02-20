import { Request, Response } from "express";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import sendResponse from "../helper/sendResponse";
import { redis } from "..";

const postCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const category = await Category.create(data);
    await redis.del("categories");
    return sendResponse(
      res,
      201,
      true,
      "Category created successfully",
      category,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to create category",
      null,
      error.message,
    );
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const cachedCategories = await redis.get("categories");
    if (cachedCategories) {
      return sendResponse(
        res,
        200,
        true,
        "Categories retrieved successfully",
        JSON.parse(cachedCategories),
      );
    }
    const categories = await Category.find();
    await redis.set("categories", JSON.stringify(categories));
    return sendResponse(
      res,
      200,
      true,
      "Categories retrieved successfully",
      categories,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to get categories",
      null,
      error.message,
    );
  }
};

const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cachedCategory = await redis.get(`category:${id}`);
    if (cachedCategory) {
      return sendResponse(
        res,
        200,
        true,
        "Category products retrieved successfully",
        JSON.parse(cachedCategory),
      );
    }
    const category = await Product.find({ categoryId: id });
    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }
    await redis.set(`category:${id}`, JSON.stringify(category));
    return sendResponse(
      res,
      200,
      true,
      "Category products retrieved successfully",
      category,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to get products",
      null,
      error.message,
    );
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }
    await redis.del("categories");
    await redis.del(`category:${id}`);
    return sendResponse(
      res,
      200,
      true,
      "Category updated successfully",
      category,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to update category",
      null,
      error.message,
    );
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }
    await redis.del("categories");
    await redis.del(`category:${id}`);
    return sendResponse(
      res,
      200,
      true,
      "Category deleted successfully",
      category,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to delete category",
      null,
      error.message,
    );
  }
};

const categoryController = {
  postCategory,
  getCategories,
  getProductsByCategory,
  updateCategory,
  deleteCategory,
};

export default categoryController;
