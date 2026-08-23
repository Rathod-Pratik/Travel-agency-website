import { Request, Response } from "express";
import { AuthModel } from "./Auth.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getUploadedFile, uploadFileToS3 } from "@utils/Function";
import {
    AuthCacheKeys,
    getCache,
    getCacheVersion,
    incrementCacheVersion,
    setCache
} from "@utils/index";
import { logger } from "@modules/log/logger";

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured on the server");
        }

        const user = await AuthModel.findOne({ email }).select("+password");

        if(user && user.isDeleted) {
            logger.warn("User login failed - account deleted", {
                metadata: {
                    email
                }
            });
            return res.status(403).json({
                success: false,
                message: "Account has been deleted. Please contact support.",
            });
        }


        if (!user || !(await bcrypt.compare(password, user.password))) {
            logger.warn("User login failed", {
                metadata: {
                    email
                }
            });

            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
            maxAge: 24 * 60 * 60 * 1000,
        };

        res.cookie("token", token, cookieOptions);

        logger.info("User login successful", {
            metadata: {
                userId: user._id.toString(),
                email: user.email
            }
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        logger.error("Login error", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const SignUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured on the server");
        }

        const ifUserExist = await AuthModel.findOne({ email });

        if (ifUserExist) {
            logger.warn("User signup failed - user already exists", {
                metadata: {
                    email
                }
            });

            return res.status(400).json({
                AlreadyExist: true,
                mesage: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await AuthModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
            maxAge: 24 * 60 * 60 * 1000,
        };

        res.cookie("token", token, cookieOptions);

        logger.info("User signup successful", {
            metadata: {
                userId: user._id.toString(),
                email: user.email
            }
        });

        res.status(201).json({
            success: true,
            message: "Signup successful",
            token
        });
    } catch (error) {
        logger.error("Signup error", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        res.status(500).send("Something went wrong");
    }
};

export const GetProfile = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {

        if (!id) {
            logger.warn("Get profile failed - user ID missing");

            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const version = await getCacheVersion(AuthCacheKeys.detailsVersion(id as string));

        const cacheKey = AuthCacheKeys.details(id as string, version);

        const cachedUser =
            await getCache(cacheKey);

        if (cachedUser) {

            logger.info("User profile fetched from Redis", {
                metadata: {
                    userId: id,
                    source: "redis"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Profile retrieved successfully",
                source: "redis",
                user: cachedUser
            });
        }

        const user = await AuthModel
            .findById(id)
            .select("-password")
            .lean();

        if (!user) {
            logger.warn("User profile not found", {
                metadata: {
                    userId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        await setCache(
            cacheKey,
            user,
            600
        );

        logger.info("User profile fetched from MongoDB", {
            metadata: {
                userId: id,
                source: "mongodb"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            source: "mongodb",
            user
        });

    } catch (error) {

        logger.error("GetProfile error", {
            metadata: {
                userId: id,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

};

export const DeleteProfile = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
        if (!id) {
            logger.warn("Delete profile failed - user ID missing");

            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const user = await AuthModel.findByIdAndUpdate(
            id,
            { isDeleted: true, DeletedAt: new Date() },
            { new: true }
        );

        if (!user) {
            logger.warn("Delete profile failed - user not found", {
                metadata: {
                    userId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "User profile not found",
            });
        }

        await incrementCacheVersion(
            AuthCacheKeys.detailsVersion(id as string)
        );

        logger.info("User profile deleted", {
            metadata: {
                userId: id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });

    } catch (error) {

        logger.error("DeleteProfile error", {
            metadata: {
                userId: id,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const UpdateProfile = async (req: Request, res: Response) => {
    const { id, name, email, address } = req.body;
    const file = getUploadedFile(req);

    try {
        if (!id) {
            logger.warn("Update profile failed - user ID missing");

            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        if (!file) {
            logger.warn("Update profile failed - image missing", {
                metadata: {
                    userId: id
                }
            });

            return res.status(400).json({
                message: "Cover image file is required"
            });
        }

        const uploadedFile = await uploadFileToS3({
            buffer: file.buffer,
            fileName: file.originalname,
            fileType: file.mimetype,
            folderType: "Blog",
        });

        const user = AuthModel.findByIdAndUpdate(
            { _id: id },
            {
                name,
                email,
                image: uploadedFile.url,
                address
            },
            { new: true }
        ).select("-password");

        if (!user) {
            logger.warn("Update profile failed - user not found", {
                metadata: {
                    userId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "User profile not found",
            });
        }

        await incrementCacheVersion(
            AuthCacheKeys.detailsVersion(id as string)
        );

        logger.info("User profile updated", {
            metadata: {
                userId: id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {

        logger.error("UpdateProfile error", {
            metadata: {
                userId: id,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const Logout = (req: Request, res: Response) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    });

    logger.info("User logged out");

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};