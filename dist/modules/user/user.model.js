"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLE = void 0;
const mongoose_1 = require("mongoose");
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["ADMIN"] = "admin";
    USER_ROLE["BUYER"] = "buyer";
    USER_ROLE["SELLER"] = "seller";
})(USER_ROLE || (exports.USER_ROLE = USER_ROLE = {}));
const UserSchema = new mongoose_1.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    role: { type: String, enum: Object.values(USER_ROLE), required: true },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    budget: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
