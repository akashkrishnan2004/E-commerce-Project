import express from "express";
import { admin } from "../controllers/admin-controller.js"

const adminRouter = express.Router();

// Admin
adminRouter.post("/login", admin);

export default adminRouter;
