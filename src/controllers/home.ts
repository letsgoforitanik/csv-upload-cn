import express, { Request, Response } from "express";

const router = express.Router();

// routes

router.get('/', getIndexPage);

// route handlers

function getIndexPage(req: Request, res: Response) {
    return res.render('home/index');
}


export { router };