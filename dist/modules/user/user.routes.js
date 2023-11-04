"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_model_1 = require("./user.model");
const router = (0, express_1.Router)();
router.get("/profile", (0, auth_1.default)(user_model_1.ROLE.BUYER, user_model_1.ROLE.SELLER), user_controller_1.userController.getProfile).patch("/profile", (0, auth_1.default)(user_model_1.ROLE.BUYER, user_model_1.ROLE.SELLER), user_controller_1.userController.updateProfile);
router
    .get("/:id", (0, auth_1.default)(user_model_1.ROLE.ADMIN), user_controller_1.userController.getUser)
    .patch("/:id", (0, auth_1.default)(user_model_1.ROLE.ADMIN), user_controller_1.userController.updateUser)
    .delete("/:id", (0, auth_1.default)(user_model_1.ROLE.ADMIN), user_controller_1.userController.deleteUser);
router.get("/", (0, auth_1.default)(user_model_1.ROLE.ADMIN), user_controller_1.userController.getUsers);
exports.userRoutes = router;
