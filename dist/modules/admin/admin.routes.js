"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.get("/", admin_controller_1.adminController.getAllAdmins);
router.post("/create-admin", admin_controller_1.adminController.createAdmin);
router.post("/login", admin_controller_1.adminController.adminLogin);
exports.adminRoutes = router;
