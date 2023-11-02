"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const signJwt = (payload, expiresIn) => {
    const secret = config_1.default.jwt_secret_key;
    const result = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiresIn,
    });
    return result;
};
exports.signJwt = signJwt;
const verifyJwt = (token) => {
    const secret = config_1.default.jwt_secret_key;
    const result = jsonwebtoken_1.default.verify(token, secret);
    return result;
};
exports.verifyJwt = verifyJwt;
