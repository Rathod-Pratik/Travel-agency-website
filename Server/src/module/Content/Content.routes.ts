import express from "express";
import { AddContent, UpdateContent } from "./Content.controller";
import {verifyAdmin} from "@middleware/Auth.middleware";
import { Validate } from "@middleware/Validation.middleware";
import { UpdateContentSchema } from "./Content.validation";
import { CreateContentSchema } from "./Content.validation";

const router = express.Router();

router.post("/",verifyAdmin,Validate(CreateContentSchema), AddContent);
router.put("/:id",verifyAdmin, Validate(UpdateContentSchema), UpdateContent);

export default router;