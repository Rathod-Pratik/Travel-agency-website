import express from "express";
import { getLogs } from "./Log.controller";
import { verifyAdmin } from "@middleware/Auth.middleware";

const router = express.Router();

router.get("/",verifyAdmin, getLogs);

export default router;