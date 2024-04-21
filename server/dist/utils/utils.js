"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByTitle = exports.sortByAcceptance = exports.sortByDifficulty = exports.existsEmail = exports.existsUsername = void 0;
const user_1 = __importDefault(require("../models/user"));
async function existsUsername(username) {
    const user = await user_1.default.findOne({ username: username });
    return !(user == null);
}
exports.existsUsername = existsUsername;
async function existsEmail(email) {
    const user = await user_1.default.findOne({ email: email });
    return !(user == null);
}
exports.existsEmail = existsEmail;
function sortByDifficulty(order, arr) {
    if (order === "")
        return arr;
    const difficultyRule = { easy: 1, medium: 2, hard: 3 };
    if (order === "asc") {
        return arr.sort((a, b) => difficultyRule[a.main.difficulty] -
            difficultyRule[b.main.difficulty]);
    }
    else {
        return arr.sort((a, b) => difficultyRule[b.main.difficulty] -
            difficultyRule[a.main.difficulty]);
    }
}
exports.sortByDifficulty = sortByDifficulty;
function sortByAcceptance(order, arr) {
    if (order === "")
        return arr;
    if (order === "asc") {
        return arr.sort((a, b) => b.main.acceptance_rate_count - a.main.acceptance_rate_count);
    }
    else {
        return arr.sort((a, b) => a.main.acceptance_rate_count - b.main.acceptance_rate_count);
    }
}
exports.sortByAcceptance = sortByAcceptance;
function sortByTitle(order, arr) {
    if (order === "")
        return arr;
    if (order === "asc") {
        return arr.sort((a, b) => a.main.id - b.main.id);
    }
    else {
        return arr.sort((a, b) => b.main.id - a.main.id);
    }
}
exports.sortByTitle = sortByTitle;
