// express extension

type AppError = { path?: string, message: string };
type SuccessResult<T> = { success: true; data: T; }
type ErrorResult = { success: false; errors: AppError[]; }
type Result<T> = SuccessResult<T> | ErrorResult;

declare namespace Express {

    type ZodError = import("zod").ZodError;

    export interface Response {
        sendErrors(statusCode: 400 | 404 | 500, error: ZodError | string): void;
        sendData(statusCode: 200 | 201, data: any, message?: string): void;
        sendMessage(message: string): void;
    }

}