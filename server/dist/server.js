"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = require("./middlewares/cors");
const MONGODB_URI = "mongodb+srv://admin:admin@cluster0.vbk62n4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(MONGODB_URI);
mongoose_1.default.connect(MONGODB_URI);
exports.db = mongoose_1.default.connection;
exports.db.on("error", console.error.bind(console, "MongoDB connection error:"));
exports.db.once("open", () => {
    console.log("Connected to MongoDB");
});
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(cors_1.customCors);
// app.use(cors());
app.use(express_1.default.json());
app.use("/api", index_1.default);
app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
});
