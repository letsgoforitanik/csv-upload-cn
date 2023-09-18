import http from "http";
import express, { Express } from "express";
import bodyParser from "body-parser";

import { environment, initializeDb } from "@/config";
import { controllerRouter } from "@/controllers";
import { extendExpress, trycatchify } from "@/helpers";
import { errorHandler } from "@/middlewares";


function configureApp(app: Express) {
    app.use(bodyParser.json());
    app.use(controllerRouter);
    app.use(errorHandler);
}


async function main() {
    const { port, nodeEnv } = environment;
    console.log(`Environment : ${nodeEnv}`);

    extendExpress();

    const app = express();

    configureApp(app);

    trycatchify(app);

    await initializeDb();
    console.log(`Database connection is made successfully`);

    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server is running at port ${port}`));
}

main();