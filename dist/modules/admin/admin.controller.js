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
exports.adminController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const admin_model_1 = __importDefault(require("./admin.model"));
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { password } = req.body;
        const saltRounds = config_1.default.salt_rounds || 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(saltRounds));
        data.password = hashedPassword;
        const admin = new admin_model_1.default(data);
        const existingAdmin = yield admin_model_1.default.findOne({
            phoneNumber: data.phoneNumber,
        });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Admin with same phone number already exists",
            });
        }
        const savedAdmin = yield admin.save();
        const response = savedAdmin.toJSON();
        response.password = "";
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Admin created successfully",
            data: response,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to create admin",
            error: error.message,
        });
    }
});
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, password } = req.body;
        const admin = yield admin_model_1.default.findOne({ phoneNumber });
        if (!admin) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Admin not found",
                data: null,
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid credentials",
                data: null,
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: admin._id, role: admin.role }, config_1.default.jwt_secret_key);
        const refreshToken = jsonwebtoken_1.default.sign({ id: admin._id, role: admin.role }, config_1.default.jwt_secret_key);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Admin logged in successfully",
            data: {
                accessToken: accessToken,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to log in",
            error: error.message,
        });
    }
});
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield admin_model_1.default.find();
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Admins retrieved successfully",
            data: admins,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve users",
            errorMessages: error.message,
        });
    }
});
exports.adminController = {
    createAdmin,
    adminLogin,
    getAllAdmins,
};
