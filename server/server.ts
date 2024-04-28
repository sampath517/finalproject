require("dotenv").config();
import express from "express";
import cors from "cors";
import router from "./routes/index";
import mongoose from "mongoose";
import { customCors } from "./middlewares/cors";

const MONGODB_URI = "mongodb+srv://admin:admin@abhiramcluster.rjmpiyb.mongodb.net/?retryWrites=true&w=majority&appName=AbhiramCluster";
console.log(MONGODB_URI);

mongoose.connect(MONGODB_URI,{dbName:"firecode"});

export const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const app: express.Application = express();
const port = process.env.PORT || 8080;

app.use(customCors);
// app.use(cors());

app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
});
