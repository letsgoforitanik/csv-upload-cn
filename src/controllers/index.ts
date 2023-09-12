import express from "express";
import * as homeController from './home';
import * as apiController from './api';

const controllerRouter = express.Router();

controllerRouter.use(homeController.router);
controllerRouter.use(apiController.router);

export default controllerRouter;