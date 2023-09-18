import { z } from "zod";
import { Types } from "mongoose";

const productDeleteValidator = z.string().nonempty().refine(val => Types.ObjectId.isValid(val), { message: "Invalid product id" });

export default productDeleteValidator;