"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    role: { type: String, default: "admin", required: true },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Admin = (0, mongoose_1.model)("Admin", adminSchema);
exports.default = Admin;
