import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomJwtPayload extends JwtPayload {
    id: string;
    email: string;
    role: string;
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check for token in cookies
        let token = req.cookies.token;

        // Check for token in Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided. Please login first.",
            });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured on the server");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// Verify admin - checks both cookies and Authorization header
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check for token in cookies
        let token = req.cookies.token;

        // Check for token in Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured on the server");
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Admin access denied. No token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as CustomJwtPayload;

        // Destructure all payload variables
        const { role } = decoded;

        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin role required.",
            });
        }
        req.body = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token",
        });
    }
};