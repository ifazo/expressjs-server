import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import Product, { IProduct } from "../models/productModel";

const createProduct = async (req: Request, res: Response) => {
  try {
    const data: IProduct = req.body;
    const product = await Product.create(data);

    return res.status(201).send({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    
    return res.status(500).send({
      success: false,
      message: err,
      data: null,
    });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const category = req.query.category as string;
    const price = req.query.price as string;
    const rating = req.query.rating as string;
    const sort = req.query.sort as string;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (q) {
      const products = await Product.find({ 
        $or: [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { features: { $regex: q, $options: "i" } }
        ]
       });
      return res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }
    else if (category) {
      const products = await Product.find({ category: category });
      return res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }
    else if (price) { 
      const products = await Product.find({ price: { $lt: price } });
      return res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }  
    else if (rating) {
      const products = await Product.find({ rating: { $gt: rating } });
      return res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }
    else if (sort) {
      let sortQuery = {};

      if (sort === 'price' || sort === 'name' || sort === 'rating') {
        sortQuery = { [sort]: 1 };
      } else {
        sortQuery = { createdAt: -1 };
      }

      const products = await Product.find().sort(sortQuery);
      return res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }

    else if (skip && limit) {
      const products = await Product.find().skip(skip).limit(limit);
      return res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }
    else {
      const products = await Product.find();
      return res.status(200).send({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }
  } catch (err) {
    console.log(err)
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
    res.status(200).send({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({
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
      return res.status(404).send({
        success: false,
        statusCode: 404,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
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
      res.status(404).send({
        success: false,
        statusCode: 404,
        message: "You are not authorized to update this cow",
      });
    }
    const updatedData: IProduct = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Cow updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
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
      res.status(404).send({
        success: false,
        message: "You are not authorized to delete this cow",
      });
    }
    const deleteProduct = await Product.findByIdAndDelete(productId);

    res.status(200).send({
      success: true,
      message: "Cow deleted successfully",
      data: deleteProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Failed to delete cow",
      data: null,
    });
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