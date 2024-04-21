"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const problemSchema = new mongoose_1.default.Schema({
    main: {
        id: Number,
        name: String,
        difficulty: String,
        like_count: Number,
        dislike_count: Number,
        description_body: String,
        accept_count: Number,
        submission_count: Number,
        acceptance_rate_count: Number,
        discussion_count: Number,
        related_topics: Array,
        similar_questions: Array,
        solution_count: Number,
        code_default_language: String,
        code_body: Object,
    },
    editorial: {
        editorial_body: String,
    },
    test: Array,
    function_name: String,
});
const ProblemModel = mongoose_1.default.model("Problem", problemSchema);
exports.default = ProblemModel;
