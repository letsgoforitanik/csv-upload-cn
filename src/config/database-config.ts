import mongoose from "mongoose";
import environment from "@/config/environment";

// mongoose initialization

export default async function initializeDb() {
    const { dbConnectionString } = environment;
    return mongoose.connect(dbConnectionString);
}