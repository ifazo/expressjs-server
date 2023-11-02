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
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = __importDefault(require("../user/user.model"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const existingUser = yield user_model_1.default.findOne({
            phoneNumber: data.phoneNumber,
        });
        if (existingUser) {
            throw new Error("User with the same phone number already exists");
        }
        const { password } = data;
        const saltRounds = config_1.default.salt_rounds || 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(saltRounds));
        const newData = Object.assign(Object.assign({}, data), { password: hashedPassword });
        const newUser = new user_model_1.default(newData);
        const result = yield newUser.save();
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to create user",
            errorMessages: error.message,
        });
    }
});
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { phoneNumber, password } = data;
        const user = yield user_model_1.default.findOne({ phoneNumber });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const payload = { id: user._id, role: user.role };
        const accessToken = (0, jwtHelpers_1.signJwt)(payload, "1d");
        const refreshToken = (0, jwtHelpers_1.signJwt)(payload, "365d");
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User logged in successfully",
            data: {
                accessToken: accessToken,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to log in",
            error: error.message,
        });
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Unauthorized",
                data: null,
            });
        }
        const decodedToken = (0, jwtHelpers_1.verifyJwt)(refreshToken);
        const { id, role } = decodedToken;
        const payload = { id, role };
        const accessToken = (0, jwtHelpers_1.signJwt)(payload, "1d");
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Refresh token generated successfully",
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
            message: "Failed to get refresh token",
            error: error.message,
        });
    }
});
exports.authController = {
    createUser,
    userLogin,
    refreshToken,
};
