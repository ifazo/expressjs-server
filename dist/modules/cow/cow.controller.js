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
exports.cowController = void 0;
const cow_model_1 = __importDefault(require("./cow.model"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const createCow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const newCow = new cow_model_1.default(data);
        const result = yield newCow.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Cow created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to create cow",
            errorMessages: error.message,
        });
    }
});
const getCows = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const count = yield cow_model_1.default.countDocuments();
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder;
        const minPrice = parseInt(req.query.minPrice);
        const maxPrice = parseInt(req.query.maxPrice);
        const location = req.query.location;
        const searchTerm = req.query.searchTerm;
        const filter = {};
        if (minPrice) {
            filter.price = { $gte: minPrice };
        }
        if (maxPrice) {
            filter.price = Object.assign(Object.assign({}, filter.price), { $lte: maxPrice });
        }
        if (location) {
            filter.location = { $regex: new RegExp(location, "i") };
        }
        if (searchTerm) {
            filter.$or = [
                { location: { $regex: new RegExp(searchTerm, "i") } },
                { breed: { $regex: new RegExp(searchTerm, "i") } },
                { category: { $regex: new RegExp(searchTerm, "i") } },
            ];
        }
        let cowsQuery = cow_model_1.default.find(filter);
        if (sortBy) {
            const sortOrderValue = sortOrder === "desc" ? -1 : 1;
            cowsQuery = cowsQuery.sort({ [sortBy]: sortOrderValue });
        }
        const cows = yield cowsQuery.skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Cows retrieved successfully",
            meta: {
                page,
                limit,
                count,
            },
            data: cows,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve cows",
            errorMessages: error.message,
        });
    }
});
const getCowById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cowId = req.params.id;
        const cow = yield cow_model_1.default.findById(cowId);
        if (!cow) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Cow not found",
            });
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Cow retrieved successfully",
            data: cow,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve cow",
            errorMessages: error.message,
        });
    }
});
const updateCowById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cowId = req.params.id;
        const cow = yield cow_model_1.default.findById(cowId);
        const sellerId = cow === null || cow === void 0 ? void 0 : cow.seller;
        const token = req.headers.authorization;
        const verifyToken = (0, jwtHelpers_1.verifyJwt)(token);
        const userId = verifyToken === null || verifyToken === void 0 ? void 0 : verifyToken.id;
        if (sellerId !== userId) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "You are not authorized to update this cow",
            });
        }
        const updatedData = req.body;
        const updatedCow = yield cow_model_1.default.findByIdAndUpdate(cowId, updatedData, {
            new: true,
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Cow updated successfully",
            data: updatedCow,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to update cow",
            errorMessages: error.message,
        });
    }
});
const deleteCowById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cowId = req.params.id;
        const cow = yield cow_model_1.default.findById(cowId);
        const sellerId = cow === null || cow === void 0 ? void 0 : cow.seller;
        const token = req.headers.authorization;
        const decoded = (0, jwtHelpers_1.verifyJwt)(token);
        const userId = decoded === null || decoded === void 0 ? void 0 : decoded.id;
        if (sellerId !== userId) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "You are not authorized to update this cow",
            });
        }
        const deletedCow = yield cow_model_1.default.findByIdAndDelete(cowId);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Cow deleted successfully",
            data: deletedCow,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to delete cow",
            errorMessages: error.message,
        });
    }
});
exports.cowController = {
    createCow,
    getCows,
    getCowById,
    updateCowById,
    deleteCowById,
};
