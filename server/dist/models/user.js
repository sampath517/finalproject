"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    submissions: Array,
    problems_starred: Array,
    problems_solved: Array,
    problems_attempted: Array,
    problems_solved_count: {
        type: Number,
        default: 0,
    },
    rank: Number,
    views: {
        type: Number,
        default: 0,
    },
    solution_count: {
        type: Number,
        default: 0,
    },
    reputation_count: {
        type: Number,
        default: 0,
    },
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
