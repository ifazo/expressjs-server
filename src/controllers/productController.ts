import { Request, Response } from "express";
import Product, { IProduct } from "../models/productModel";
import sendResponse from "../helper/sendResponse";
import { redis } from "..";

const createProduct = async (req: Request, res: Response) => {
  try {
    const data: IProduct = req.body;
    const product = await Product.create(data);
    await redis.del("products");
    return sendResponse(
      res,
      201,
      true,
      "Product created successfully",
      product,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to create product",
      null,
      error.message,
    );
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const cachedProducts = await redis.get("products");
    if (cachedProducts) {
      return sendResponse(res, 200, true, "Products retrieved successfully", JSON.parse(cachedProducts));
    }
    const q = req.query.q as string;
    const category = req.query.category as string;
    const price = req.query.price as string;
    const rating = req.query.rating as string;
    const sort = req.query.sort as string;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    let products;
    if (q) {
      products = await Product.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { features: { $regex: q, $options: "i" } },
        ],
      });
    } else if (category) {
      products = await Product.find({ category: category });
    } else if (price) {
      products = await Product.find({ price: { $lt: price } });
    } else if (rating) {
      products = await Product.find({ rating: { $gt: rating } });
    } else if (sort) {
      let sortQuery = {};
      if (sort === "price" || sort === "name" || sort === "rating") {
        sortQuery = { [sort]: 1 };
      } else {
        sortQuery = { createdAt: -1 };
      }
      products = await Product.find().sort(sortQuery);
    } else if (skip && limit) {
      products = await Product.find().skip(skip).limit(limit);
    } else {
      products = await Product.find();
    }

    await redis.set("products", JSON.stringify(products));
    return res.status(200).send({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: err,
      data: null,
    });
  }
};

const getRandomProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 6 } }]);
    return sendResponse(
      res,
      200,
      true,
      "Products retrieved successfully",
      products,
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

const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const cachedProduct = await redis.get(`product:${productId}`);
    if (cachedProduct) {
      return sendResponse(res, 200, true, "Product retrieved successfully", JSON.parse(cachedProduct));
    }
    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }
    await redis.set(`product:${productId}`, JSON.stringify(product));
    return sendResponse(
      res,
      200,
      true,
      "Product retrieved successfully",
      product,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to get product",
      null,
      error.message,
    );
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: Partial<IProduct> = req.body;
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }
    await redis.del("products");
    await redis.del(`product:${id}`);
    return sendResponse(
      res,
      200,
      true,
      "Product updated successfully",
      product,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to update product",
      null,
      error.message,
    );
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }
    await redis.del(`product:${id}`);
    await redis.del("products");
    return sendResponse(
      res,
      200,
      true,
      "Product deleted successfully",
      product,
    );
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to delete product",
      null,
      error.message,
    );
  }
};

const productController = {
  createProduct,
  getProducts,
  getRandomProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

export default productController;
