import { number, z } from "zod";
import { Types } from "mongoose";

function preprocess(value: any) {
    const { id, number } = value;

    return {
        id: id,
        number: number ? Number(number) : ""
    };
}

const productUpdateValidator = z.preprocess(preprocess, z.object({
    id: z.string().nonempty("Id can't be blank").refine(val => Types.ObjectId.isValid(val), { message: "Invalid product id" }),
    number: z.union([
        z.string().nonempty("Number can't be blank"),
        z.number({ required_error: "Invalid input" })
    ]).transform(val => +val)
}));


export default productUpdateValidator;