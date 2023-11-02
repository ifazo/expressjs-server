"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cow_constant_1 = require("./cow.constant");
const CowSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: {
        type: String,
        enum: Object.values(cow_constant_1.COW_LOCATION),
        required: true,
    },
    breed: { type: String, enum: Object.values(cow_constant_1.COW_BREED), required: true },
    weight: { type: Number, required: true },
    label: {
        type: String,
        default: cow_constant_1.COW_LABEL.FOR_SALE,
    },
    category: {
        type: String,
        enum: Object.values(cow_constant_1.COW_CATEGORY),
        required: true,
    },
    seller: { type: String, ref: "User", required: true },
});
// Create and export the Cow model
const Cow = (0, mongoose_1.model)("Cow", CowSchema);
exports.default = Cow;
