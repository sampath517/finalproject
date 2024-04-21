import { NextFunction } from "express";
import express from "express";
import jwt from "jsonwebtoken";
require("dotenv");

interface UserRequest extends express.Request {
    user?: string;
}

export function authenticateToken(
    req: UserRequest,
    res: express.Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader;

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Token not provided" });
    }

    jwt.verify(token, "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTE5MTAzMjUsImV4cCI6MTc0MzQ0NjMyNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.wExoY22MGhSF6dgfNcb6vLMJFuSd3IqhCEDA25Aobz8", (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid token" });
        }
        req.user = decoded?.toString();
        next();
    });
}
