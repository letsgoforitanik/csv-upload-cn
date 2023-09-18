import express from "express";
import { apiRouter } from "./api";


const controllerRouter = express.Router();

controllerRouter.use("/api", apiRouter);

export { controllerRouter };