"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv");
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Token not provided" });
    }
    jsonwebtoken_1.default.verify(token, "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTE5MTAzMjUsImV4cCI6MTc0MzQ0NjMyNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.wExoY22MGhSF6dgfNcb6vLMJFuSd3IqhCEDA25Aobz8", (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid token" });
        }
        req.user = decoded?.toString();
        next();
    });
}
exports.authenticateToken = authenticateToken;
