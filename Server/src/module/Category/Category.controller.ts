import { Request, Response } from "express";
import { CategoryModel } from "./Category.model";
import { CategoryCacheKeys, incrementCacheVersion, setCache, getCache, getCacheVersion } from "@utils/index";
import { logger } from "@modules/log/logger";

export const CreateCategory = async (req: Request, res: Response) => {
    const { name, slug, description, icon, isHomePage } = req.body;
    try {
        const category = await CategoryModel.create({
            name,
            slug,
            description,
            icon,
            isHomePage
        }); if (!category) {
            logger.error("Category creation failed", {
                metadata: {
                    name,
                    slug,
                    description,
                    icon,
                    isHomePage
                },
            });
            return res.status(400).json({ message: "Category creation failed" });
        }
        logger.info("Category created successfully", {
            metadata: {
                categoryId: category._id.toString(),
                name: category.name,
                isHomePage: category.isHomePage
            },
        });
        await incrementCacheVersion(CategoryCacheKeys.listVersion());
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        logger.error("Internal server error", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Internal server error" });
    }
}

export const UpdateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, description, icon, isHomePage } = req.body;
    try {
        const category = await CategoryModel.findByIdAndUpdate(id, { name, slug, description, icon, isHomePage }, { new: true });
        if (!category) {
            logger.warn("Category update failed - category not found", {
                metadata: {
                    categoryId: id,
                },
            });
            return res.status(404).json({ message: "Category not found" });
        }
        await incrementCacheVersion(CategoryCacheKeys.listVersion());
        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        logger.error("Internal server error", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Internal server error" });
    }
}

export const DeleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await CategoryModel.findByIdAndUpdate(id, { isDeleted: true, DeletedAt: new Date() }, { new: true });
        if (!category) {
            logger.warn("Category deletion failed - category not found", {
                metadata: {
                    categoryId: id,
                },
            });
            return res.status(404).json({ message: "Category not found" });
        }
        await incrementCacheVersion(CategoryCacheKeys.listVersion());
        res.status(200).json({ message: "Category deleted successfully", category });
    } catch (error) {
        logger.error("Internal server error", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Internal server error" });
    }
}
export const GetCategory = async (req: Request, res: Response) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    if (page < 1) {
        page = 1;
    }
    if (limit < 1) {
        limit = 10;
    }
    if (limit > 100) {
        limit = 100;
    }
    try {
        const version = await getCacheVersion(CategoryCacheKeys.listVersion());
        const cacheKey = CategoryCacheKeys.list(version, page, limit);
        const cachedCategories = await getCache(cacheKey);
        if (cachedCategories) {
            return res.status(200).json({
                message: "Categories fetched successfully",
                categories: cachedCategories,
                source: "redis"
            });
        }

        const categories = await CategoryModel.find({ isDeleted: false })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        await setCache(cacheKey, categories, 1800);
        res.status(200).json({ message: "Categories fetched successfully", categories });
    } catch (error) {
        logger.error("Internal server error", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Internal server error" });
    }
}

export const GetCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const version = await getCacheVersion(CategoryCacheKeys.detailsVersion(id as string));
        const cacheKey = CategoryCacheKeys.details(id as string, version);
        const cachedCategory = await getCache(cacheKey);
        if (cachedCategory) {
            return res.status(200).json({
                message: "Category fetched successfully",
                category: cachedCategory,
                source: "redis"
            });
        }
        const category = await CategoryModel.findById(id);
        if (!category || category.isDeleted) {
            logger.warn("Category not found", {
                metadata: {
                    categoryId: id,
                },
            });
            return res.status(404).json({ message: "Category not found" });
        }
        await setCache(cacheKey, category, 1800);
        res.status(200).json({ message: "Category fetched successfully", category });
    } catch (error) {
        logger.error("Internal server error", {
            metadata: {
                error: error instanceof Error
                    ? error.message
                    : String(error),
            },
        });
        res.status(500).json({ message: "Internal server error" });
    }
}