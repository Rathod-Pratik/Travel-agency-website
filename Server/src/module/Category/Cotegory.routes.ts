import express from "express";
import { GetCategories, DeleteCategory, UpdateCategory, CreateCategory } from "./Category.controller";
import { verifyAdmin } from "@middleware/Auth.middleware";
import { Validate } from "@middleware/Validation.middleware";
import { CategoryIdSchema, CategorySchema, UpdateCategorySchema } from "./Category.validation";

const Route = express.Router();

Route.post("/", verifyAdmin, Validate(CategorySchema), CreateCategory);
Route.put("/:id", verifyAdmin, Validate(UpdateCategorySchema), UpdateCategory);
Route.delete("/:id", verifyAdmin, Validate(CategoryIdSchema), DeleteCategory);
Route.get("/", GetCategories);

export default Route;