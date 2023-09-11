import { Request, Response, NextFunction } from "express";

export default function locals(req: Request, res: Response, next: NextFunction) {
    res.locals.viewBag = {};
    next();
}

