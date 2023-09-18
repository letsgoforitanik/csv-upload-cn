import { Schema, model } from "mongoose";
import { IProduct } from "@/types/model";

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: Schema.Types.String,
            required: true
        },
        quantity: {
            type: Schema.Types.Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Product = model<IProduct>('Product', productSchema);

export default Product;

