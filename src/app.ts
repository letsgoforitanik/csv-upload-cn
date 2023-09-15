import http from "http";
import express, { Express } from "express";
import ejsLayouts from "express-ejs-layouts";
import session from "express-session";
import flash from "connect-flash";

import controllerRouter from "@/controllers";
import { environment, initializeDb, sessionConfig } from "@/config";
import { locals, errorHandler } from "@/middlewares";
import { extendExpress, getPath, trycatchify } from "@/helpers";


function configureAppSettings(app: Express) {
    const fileRoot = environment.nodeEnv === 'production' ? 'dist' : 'src';

    app.set("view engine", "ejs");
    app.set("views", getPath(fileRoot, "views"));
    app.set("layout", getPath(fileRoot, "views/layout/main"));
}


function configureApp(app: Express) {
    app.use(ejsLayouts);
    app.use(express.static('dist/public'));
    app.use(session(sessionConfig));
    app.use(flash());
    app.use(locals);
    app.use(controllerRouter);
    app.use(errorHandler);
}

async function main() {
    const { port, nodeEnv } = environment;
    console.log(`Environment : ${nodeEnv}`);

    extendExpress();

    const app = express();

    configureApp(app);
    configureAppSettings(app);

    trycatchify(app);

    await initializeDb();
    console.log(`Database connection is made successfully`);

    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server is running at port ${port}`));

}

main();