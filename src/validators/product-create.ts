import { z } from "zod";

const productCreationValidator = z
    .object({
        product: z.object({
            name: z.string().nonempty("Name can't be blank"),
            quantity: z.coerce.number().gt(0, "Quantity must be greater than 0")
        })
    })
    .transform(val => ({ ...val.product }));

export default productCreationValidator;