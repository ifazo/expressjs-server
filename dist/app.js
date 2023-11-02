"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const admin_routes_1 = require("./modules/admin/admin.routes");
const user_routes_1 = require("./modules/user/user.routes");
const cow_routes_1 = require("./modules/cow/cow.routes");
const order_routes_1 = require("./modules/order/order.routes");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// app.use(errorHandler);
exports.app.use("/api/v1/auth", auth_routes_1.authRoutes);
exports.app.use("/api/v1/admins", admin_routes_1.adminRoutes);
exports.app.use("/api/v1/users", user_routes_1.userRoutes);
exports.app.use("/api/v1/cows", cow_routes_1.cowRoutes);
exports.app.use("/api/v1/orders", order_routes_1.orderRoutes);
exports.app.get("/", (_req, res) => {
    res.send("Online cow hut is running successfully");
});
