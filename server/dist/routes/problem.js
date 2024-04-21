"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createTest_1 = require("../utils/createTest");
const problem_1 = __importDefault(require("../models/problem"));
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils/utils");
const problem = express_1.default.Router();
problem.post("/all", async (req, res) => {
    const { id } = req.body;
    const search = req.query.search || "";
    const difficulty = req.query.difficulty || "";
    const acceptance = req.query.acceptance || "";
    const title = req.query.title || "";
    try {
        const allProblems = await problem_1.default.find({ "main.name": { $regex: search, $options: "i" } }, "main.id main.name main.acceptance_rate_count main.difficulty main.like_count main.dislike_count")
            .sort({ "main.id": 1 })
            .exec();
        const allProblemsSorted = (0, utils_1.sortByAcceptance)(acceptance.toString(), (0, utils_1.sortByDifficulty)(difficulty.toString(), (0, utils_1.sortByTitle)(title.toString(), allProblems)));
        const user = await user_1.default.findById(id);
        const sOrA = {
            solved: user?.problems_solved,
            attempted: user?.problems_attempted,
        };
        let allProblemsArray = JSON.parse(JSON.stringify(allProblemsSorted));
        if (sOrA.attempted) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.attempted.includes(allProblemsArray[i].main.name)) {
                    allProblemsArray[i].main.status = "attempted";
                }
            }
        }
        if (sOrA.solved) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.solved.includes(allProblemsArray[i].main.name)) {
                    allProblemsArray[i].main.status = "solved";
                }
            }
        }
        res.json(allProblemsArray);
    }
    catch (e) {
        console.log(e);
        res.json({ success: false, message: "Internal Server Error" });
    }
});
problem.post("/submit/:name", async (req, res) => {
    const { name } = req.params;
    const { id, problem_name } = req.body;
    try {
        const problem = await problem_1.default.findOne({
            "main.name": name,
        });
        const user = await user_1.default.findById(id);
        if (!user) {
            res.json([
                {
                    problem_name: problem_name,
                    status: "Runtime Error",
                    error: "user not found",
                    time: new Date(),
                    runtime: 0,
                    language: "JavaScript",
                    memory: Math.random() * 80,
                    code_body: undefined,
                },
            ]);
            return;
        }
        let history;
        if (user.submissions) {
            history = user.submissions;
        }
        else {
            history = null;
        }
        if (problem) {
            (0, createTest_1.writeTestFile)(req.body.code, problem.test, problem.function_name)
                .then(async (resolve) => {
                if (resolve.stdout != undefined) {
                    console.log(resolve.stdout);
                    let submission = [
                        {
                            problem_name: problem_name,
                            status: resolve.stdout.status,
                            error: resolve.stdout.error_message,
                            time: resolve.stdout.date,
                            runtime: resolve.stdout.runtime,
                            language: "JavaScript",
                            memory: Math.random() * 80,
                            code_body: resolve.code_body,
                            input: resolve.stdout.input,
                            expected_output: resolve.stdout.expected_output,
                            user_output: resolve.stdout.user_output,
                        },
                    ];
                    if (history != null) {
                        submission.push(...history);
                    }
                    const subsByName = submission.filter((elem) => elem.problem_name === problem_name);
                    user.submissions = submission;
                    if (submission[0].status === "Accepted") {
                        if (!user.problems_solved.includes(problem_name)) {
                            user.problems_solved.push(problem_name);
                            user.problems_solved_count += 1;
                        }
                    }
                    else {
                        if (!user.problems_attempted.includes(problem_name)) {
                            user.problems_attempted.push(problem_name);
                        }
                    }
                    await user.save();
                    res.json(subsByName);
                }
            })
                .catch(async (e) => {
                let submission = [
                    {
                        problem_name: problem_name,
                        status: "Runtime Error",
                        error: e,
                        time: new Date(),
                        runtime: 0,
                        language: "JavaScript",
                        memory: Math.random() * 80,
                        code_body: undefined,
                    },
                ];
                if (history) {
                    submission.push(...history);
                }
                if (!user.problems_attempted.includes(problem_name)) {
                    user.problems_attempted.push(problem_name);
                }
                const subsByName = submission.filter((elem) => elem.problem_name === problem_name);
                user.submissions = submission;
                await user.save();
                res.json(subsByName);
            });
        }
    }
    catch (e) {
        console.log(e);
    }
});
problem.post("/submissions/:name", async (req, res) => {
    const { name } = req.params;
    const { id } = req.body;
    try {
        const user = await user_1.default.findById(id);
        if (!user) {
            res.json([]);
            return;
        }
        if (!user.submissions) {
            res.json([]);
            return;
        }
        const subsByName = user.submissions.filter((elem) => elem.problem_name === name);
        res.json(subsByName);
    }
    catch (e) {
        console.log(e);
        res.json([]);
    }
});
problem.post("/:name", async (req, res) => {
    const { name } = req.params;
    const { id } = req.body;
    try {
        const problem = await problem_1.default.findOne({
            "main.name": name,
        });
        const user = await user_1.default.findById(id);
        const problemJson = JSON.parse(JSON.stringify(problem));
        if (user?.problems_attempted.includes(name)) {
            problemJson.main.status = "attempted";
        }
        if (user?.problems_solved.includes(name)) {
            problemJson.main.status = "solved";
        }
        if (problemJson) {
            const response = problemJson;
            res.json(response);
        }
        else {
            res.json({ error: "problem not found" });
        }
    }
    catch (e) {
        console.log(e);
    }
});
problem.get("/:name/editorial", async (req, res) => {
    const name = req.params.name;
    try {
        const problem = await problem_1.default.findOne({
            "main.name": name,
        });
        if (problem) {
            const response = problem.editorial;
            res.json(response);
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.default = problem;
