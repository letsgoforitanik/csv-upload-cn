import express from "express";
import * as homeController from './home';
import * as apiController from './api';
import * as errorController from "./error";

const controllerRouter = express.Router();

controllerRouter.use(homeController.router);
controllerRouter.use(apiController.router);
controllerRouter.use(errorController.router);

export default controllerRouter;