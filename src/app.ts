import http from "http";
import express, { Express } from "express";
import ejsLayouts from "express-ejs-layouts";
import controllerRouter from "@/controllers";
import { environment, initializeDb } from "@/config";
import { locals } from "@/middlewares";
import { getPath } from "@/helpers";


function configureAppSettings(app: Express) {
    const fileRoot = environment.nodeEnv === 'production' ? 'dist' : 'src';

    app.set("view engine", "ejs");
    app.set("views", getPath(fileRoot, "views"));
    app.set("layout", getPath(fileRoot, "views/layout/main"));
}


function configureApp(app: Express) {
    app.use(ejsLayouts);
    app.use(express.static('dist/public'));
    app.use(locals);
    app.use(controllerRouter);
}

async function main() {
    const { port, nodeEnv } = environment;
    console.log(`Environment : ${nodeEnv}`);

    const app = express();

    configureApp(app);
    configureAppSettings(app);

    await initializeDb();
    console.log(`Database connection is made successfully`);

    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server is running at port ${port}`));

}

main();