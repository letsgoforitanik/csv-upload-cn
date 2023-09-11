import express from "express";
import * as homeController from './home';

const controllerRouter = express.Router();

controllerRouter.use(homeController.router);

export default controllerRouter;