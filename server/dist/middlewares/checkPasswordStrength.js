"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkPasswordStrength;
const zxcvbn_1 = __importDefault(require("zxcvbn"));
function checkPasswordStrength(req, res, next) {
    const { password } = req.body;
    const result = (0, zxcvbn_1.default)(password);
    if (result.score < 3) {
        res.status(400).json({ message: "Please pick a stronger password!" });
        return;
    }
    next();
}
