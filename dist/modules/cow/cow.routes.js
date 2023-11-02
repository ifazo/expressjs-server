"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cow_controller_1 = require("./cow.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_model_1 = require("../user/user.model");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, auth_1.default)(user_model_1.USER_ROLE.ADMIN), cow_controller_1.cowController.createCow)
    .get((0, auth_1.default)(user_model_1.USER_ROLE.ADMIN, user_model_1.USER_ROLE.BUYER, user_model_1.USER_ROLE.SELLER), cow_controller_1.cowController.getCows);
router
    .route("/:id")
    .get((0, auth_1.default)(user_model_1.USER_ROLE.ADMIN, user_model_1.USER_ROLE.BUYER, user_model_1.USER_ROLE.SELLER), cow_controller_1.cowController.getCowById)
    .patch((0, auth_1.default)(user_model_1.USER_ROLE.SELLER), cow_controller_1.cowController.updateCowById)
    .delete((0, auth_1.default)(user_model_1.USER_ROLE.SELLER), cow_controller_1.cowController.deleteCowById);
exports.cowRoutes = router;
