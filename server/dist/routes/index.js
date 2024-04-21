"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const problem_1 = __importDefault(require("./problem"));
const accounts_1 = __importDefault(require("./accounts"));
const router = express_1.default.Router();
router.use("/problem", problem_1.default);
router.use("/accounts", accounts_1.default);
exports.default = router;
