import express from "express";
import { ZodError } from "zod";

// helper methods
export default function extendExpress() {

    // creates a json-parser friendly error response 
    // and sends to client
    express.response.sendErrors = function (statusCode: number, args: any) {
        if (args.constructor.name === 'ZodError') {
            const error = args as ZodError;
            const errors: AppError[] = error.errors.map(({ path, message }) => ({ path: path.toString(), message }));
            return this.status(statusCode).json({ success: false, errors });
        }

        if (typeof args === 'string') {
            return this.status(statusCode).json({ success: false, errors: [{ path: "", message: args }] });
        }

    }


    // creates a json-parser friendly success response 
    // containing the data and sends to client
    express.response.sendData = function (statusCode: number, data: any, message?: string) {
        const response: any = { success: true, data };
        message && (response.message = message);
        return this.status(statusCode).json(response);
    }


    // wraps the given message in a success response 
    // and sends to client
    express.response.sendMessage = function (message: string) {
        return this.status(200).json({ success: true, message });
    }

}