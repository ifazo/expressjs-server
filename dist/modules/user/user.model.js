"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE = void 0;
const mongoose_1 = require("mongoose");
var ROLE;
(function (ROLE) {
    ROLE["ADMIN"] = "admin";
    ROLE["BUYER"] = "buyer";
    ROLE["SELLER"] = "seller";
})(ROLE || (exports.ROLE = ROLE = {}));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ROLE, default: ROLE.BUYER },
    date: { type: Date, default: Date.now },
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
