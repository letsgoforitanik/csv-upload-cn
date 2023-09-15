import fs from "fs";
import fspromises from "fs/promises";
import express, { Request, Response } from "express";
import moment from "moment";
import { parse } from "csv-parse";
import { uploadCsv } from "@/config";
import { getPath } from "@/helpers";
import { csvService } from "@/services";

const router = express.Router();

// routes

router.get('/', getIndexPage);
router.post('/save-csv', saveCsv);
router.get('/delete-csv/:id', deleteCsv);
router.get('/browse-csv/:id', getBrowseCsvPage);

// route handlers

// Page that lists all .csv files that have been uploaded
async function getIndexPage(req: Request, res: Response) {
    const result = await csvService.getAllCsv();
    const csvList = result.data;
    return res.render('home/index', { csvList, moment });
}

// This method first uploads the file, if during uploading
// any error occurs, it reports to the client. After uploading,
// it tries to parse the file content using csv-parser. If parsing
// fails, it removes the uploaded file and reports to client.
// If it becomes successful in parsing, it transforms the file content
// into an array of objects, and stores the content in database, along
// with original file name and upload date and time. 
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

        parser.on('error', async () => {
            stream.close();
            await fspromises.unlink(filePath);

            req.setFlashErrors('Parsing error. Try different file');
            return res.redirect('back');
        });

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

            req.setFlashMessage('File uploaded successfully');
            return res.redirect('back');


        });

    });
}

// Delete uploaded .csv file
async function deleteCsv(req: Request, res: Response) {
    const id = req.params.id;
    await csvService.deleteCsv(id);
    req.setFlashMessage('File deleted successfully');
    return res.redirect('back');
}

// Get csv-browser page
function getBrowseCsvPage(req: Request, res: Response) {
    const fileId = req.params.id;
    return res.render('home/browse-csv', { fileId });
}


export { router };