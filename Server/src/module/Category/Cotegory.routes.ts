import express from "express";
import { GetCategory, DeleteCategory, UpdateCategory, CreateCategory } from "./Category.controller";
import { } from "./Category.controller";
import { verifyAdmin } from "@middleware/Auth.middleware";
import { Validate } from "@middleware/Validation.middleware";
import { CategoryIdSchema, CategorySchema } from "./Category.validation";

const Route = express.Router();

Route.post("/",verifyAdmin,Validate(CategorySchema), CreateCategory);
Route.put("/:id",verifyAdmin, Validate(CategoryIdSchema), UpdateCategory);
Route.delete("/:id",verifyAdmin, Validate(CategoryIdSchema), DeleteCategory);
Route.get("/", GetCategory);

export default Route;