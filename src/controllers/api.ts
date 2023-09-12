import { csvService } from "@/services";
import express, { Request, Response } from "express";

const router = express.Router();
const apiRouter = express.Router();

// routes

router.use('/api', apiRouter);
apiRouter.get('/csv-content/:id', getCsvContent);

// route handlers

async function getCsvContent(req: Request, res: Response) {
    const fileId = req.params.id;
    const result = await csvService.getCsv(fileId);
    return res.json(result);
}

export { router };