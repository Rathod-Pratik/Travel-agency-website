import { Request, Response } from "express"
import { AuthModel } from "./Auth.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getUploadedFile, uploadFileToS3 } from "@utils/Function";
import { AuthCacheKeys, getCache, getCacheVersion, incrementCacheVersion, setCache } from "@utils/index";

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Explicitly check JWT secret before signing
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured on the server");
        }

        const user = await AuthModel.findOne({ email }).select("+password");

        // Generic response prevents account enumeration
        if (!user || !(await bcrypt.compare(password, user.password))) {
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

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const SignUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Explicitly check JWT secret before signing
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured on the server");
        }

        const ifUserExist = await AuthModel.findOne({ email });
        if (ifUserExist) {
            return res.status(400).json({ AlreadyExist: true, mesage: "User already exists" });
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

        res.status(201).json({
            success: true,
            message: "Signup successful",
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}

export const GetProfile = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const version = await getCacheVersion(AuthCacheKeys.detailsVersion(id as string));

        const cacheKey = AuthCacheKeys.details(id as string, version);
        // Check Redis
        const cachedUser =
            await getCache(cacheKey);

        if (cachedUser) {

            return res.status(200).json({
                success: true,
                message: "Profile retrieved successfully",
                source: "redis",
                user: cachedUser
            });
        }

        // MongoDB
        const user = await AuthModel
            .findById(id)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        // Cache profile for 10 minutes
        await setCache(
            cacheKey,
            user,
            600
        );

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            source: "mongodb",
            user
        });

    } catch (error) {

        console.error(
            "GetProfile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export const DeleteProfile = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const user = AuthModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found",
            });
        }

        await incrementCacheVersion(AuthCacheKeys.detailsVersion(id as string));
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });
    } catch (error) {
        console.error("DeleteProfile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const UpdateProfile = async (req: Request, res: Response) => {
    const { id, name, email, address } = req.body;
    const file = getUploadedFile(req);

    try {
        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        if (!file) {
            return res.status(400).json({ message: "Cover image file is required" });
        }

        const uploadedFile = await uploadFileToS3({
            buffer: file.buffer,
            fileName: file.originalname,
            fileType: file.mimetype,
            folderType: "Blog",
        });

        const user = AuthModel.findByIdAndUpdate({ _id: id }, { name, email, image: uploadedFile.url, address }, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found",
            });
        }
        await incrementCacheVersion(AuthCacheKeys.detailsVersion(id as string));
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {
        console.error("UpdateProfile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const Logout = (req: Request, res: Response) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: (isProduction ? "none" : "lax") as "none" | "lax", });
    res.status(200).json({ success: true, message: "Logged out successfully" });

}