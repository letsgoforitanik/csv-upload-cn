import multer, { Options } from "multer";
import { getPath } from "@/helpers";

const options: Options = {
    storage: multer.diskStorage({
        destination: getPath('dist/public/uploads'),
        filename: (req, file, cv) => cv(null, 'file.csv')
    }),
    fileFilter: function (req, file, cb) {
        const shouldReject = file.mimetype !== 'text/csv' || !file.originalname.endsWith('csv');
        if (shouldReject) return cb(new Error('Upload .csv file'));
        return cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}

const upload = multer(options);

const uploadCsv = upload.single('file');

export default uploadCsv;