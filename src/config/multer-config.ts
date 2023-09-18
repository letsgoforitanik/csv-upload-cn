import multer, { Options } from "multer";
import { getPath } from "@/helpers";

// multer config for .csv files

const options: Options = {
    storage: multer.diskStorage({
        destination: getPath('dist/public/uploads'), // where to store
        filename: (req, file, cv) => cv(null, 'file.csv') // what name to give to the stored file
    }),
    fileFilter: function (req, file, cb) {
        // reject all files that don't have .csv extension
        const shouldReject = file.mimetype !== 'text/csv' || !file.originalname.endsWith('csv');
        if (shouldReject) return cb(new Error('Upload .csv file'));
        return cb(null, true);
    },
    limits: {
        // 5 mb max file size
        fileSize: 5 * 1024 * 1024
    }
}

const upload = multer(options);

const uploadCsv = upload.single('file');

export default uploadCsv;