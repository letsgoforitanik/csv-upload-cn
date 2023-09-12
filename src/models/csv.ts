import { Schema, model } from "mongoose";
import { ICSV } from "@/types/model";

const csvSchema = new Schema<ICSV>(
    {
        fileName: {
            type: Schema.Types.String,
            required: true
        },
        contents: {
            type: [],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const CSV = model<ICSV>('CSV', csvSchema);

export default CSV;