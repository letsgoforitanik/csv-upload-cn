import dotenv from "dotenv";

dotenv.config();

// all environment variables

const environment = {
    nodeEnv: process.env.NODE_ENV!,
    port: process.env.PORT!,
    dbConnectionString: process.env.DB_CONNECTION_STRING!
};

export default environment;