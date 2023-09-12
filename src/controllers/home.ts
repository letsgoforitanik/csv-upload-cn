import fs from "fs";
import fspromises from "fs/promises";
import express, { Request, Response } from "express";
import { parse } from "csv-parse";
import { uploadCsv } from "@/config";
import { getPath } from "@/helpers";
import { csvService } from "@/services";

const router = express.Router();

// routes

router.get('/', getIndexPage);
router.post('/save-csv', saveCsv);

// route handlers

function getIndexPage(req: Request, res: Response) {
    return res.render('home/index');
}


function saveCsv(req: Request, res: Response) {

    uploadCsv(req, res, async function (error) {

        if (error instanceof Error) {
            req.setFlashErrors(error.message);
            return res.redirect('back');
        }

        const filePath = getPath('dist/public/uploads/file.csv');

        if (req.file?.size === 0) {
            await fspromises.unlink(filePath);
            req.setFlashErrors('Upload non-empty .csv file');
            return res.redirect('back');
        }

        const stream = fs.createReadStream(filePath);
        const parser = stream.pipe(parse());
        const result: string[][] = [];

        parser.on('data', data => result.push(data));

        parser.on('end', async () => {

            const contents: any[] = [];

            for (let i = 1; i < result.length; i++) {

                const content: any = {};

                for (let j = 0; j < result[i].length; j++) {
                    content[result[0][j]] = result[i][j];
                }

                contents.push(content);

            }

            await csvService.addCsv(req.file!.originalname, contents);
            await fspromises.unlink(filePath);

            req.setFlashMessage('CSV file uploaded successfully');
            return res.redirect('back');


        });

    });
}


export { router };