"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const cow_model_1 = __importDefault(require("../cow/cow.model"));
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("../user/user.model"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const user = yield user_model_1.default.findById(data.buyer);
        const cow = yield cow_model_1.default.findById(data.cow);
        if (!user || !cow) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User or cow not found",
            });
        }
        if ((cow === null || cow === void 0 ? void 0 : cow.label) === "sold out") {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Cow is already sold out",
            });
        }
        if ((user === null || user === void 0 ? void 0 : user.role) !== "buyer") {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User is not a buyer",
            });
        }
        if (user.budget < cow.price) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not have enough budget",
            });
        }
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        yield cow_model_1.default.findByIdAndUpdate(data.cow, { $set: { label: "sold out" } });
        yield cow.save({ session });
        user.budget -= cow.price;
        yield user.save({ session });
        yield user_model_1.default.findOneAndUpdate({ _id: cow.seller }, { $inc: { income: cow.price } }, { new: true, session });
        const order = new order_model_1.default(Object.assign({}, data));
        yield order.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Order created successfully",
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to create order",
            error: error.message,
        });
    }
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const decoded = (0, jwtHelpers_1.verifyJwt)(token);
        const userId = decoded === null || decoded === void 0 ? void 0 : decoded.id;
        const orders = yield order_model_1.default.find({ buyer: userId });
        if (!orders) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Orders not found",
            });
        }
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Orders retrieved successfully",
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve orders",
            error: error.message,
        });
    }
});
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield order_model_1.default.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Order not found",
            });
        }
        const token = req.headers.authorization;
        const decoded = (0, jwtHelpers_1.verifyJwt)(token);
        const userId = decoded === null || decoded === void 0 ? void 0 : decoded.id;
        if (order.buyer !== userId) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "You don't have permission to access this order",
            });
        }
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Order retrieved successfully",
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve order",
            error: error.message,
        });
    }
});
exports.orderController = {
    createOrder,
    getAllOrders,
    getOrderById,
};
