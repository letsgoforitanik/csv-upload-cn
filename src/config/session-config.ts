import session, { SessionOptions } from "express-session";
import createMongoDBStore from "connect-mongodb-session";
import { environment } from "@/config";

// session config to store session in MongoDB

const MongoDBStore = createMongoDBStore(session);

const store = new MongoDBStore({ uri: environment.dbConnectionString, collection: 'sessions' });

store.on('error', error => console.log(error));

const sessionConfig: SessionOptions = {
    name: 'csv-parser-cn',
    secret: environment.sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 20 * 60 * 1000 },
    store
};

export default sessionConfig;