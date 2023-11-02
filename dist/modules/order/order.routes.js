"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_model_1 = require("../user/user.model");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(user_model_1.USER_ROLE.ADMIN, user_model_1.USER_ROLE.BUYER, user_model_1.USER_ROLE.SELLER), order_controller_1.orderController.getAllOrders)
    .post((0, auth_1.default)(user_model_1.USER_ROLE.BUYER), order_controller_1.orderController.createOrder);
router
    .route("/:id")
    .get((0, auth_1.default)(user_model_1.USER_ROLE.ADMIN, user_model_1.USER_ROLE.BUYER, user_model_1.USER_ROLE.SELLER), order_controller_1.orderController.getOrderById);
exports.orderRoutes = router;
