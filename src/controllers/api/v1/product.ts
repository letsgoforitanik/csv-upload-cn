import express, { Request, Response } from "express";

import { productCreationValidator, productFetchValidator } from "@/validators";
import { productDeleteValidator, productUpdateValidator } from "@/validators";
import { productService } from "@/services";

const router = express.Router();
const productRouter = express.Router();

// routes

router.use('/products', productRouter);
productRouter.post('/create', createProduct);
productRouter.get('/', getProducts);
productRouter.get('/:id', getProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.post('/:id/update_quantity', updateProductQuantity);

// route handlers



// stores a product in database
async function createProduct(req: Request, res: Response) {

    const result = productCreationValidator.safeParse(req.body);

    if (!result.success) {
        res.sendErrors(400, result.error);
        return;
    }

    const response = await productService.createProduct(result.data);
    const product = response.data;

    res.header('location', `/api/v1/products/${product.id}`);
    return res.sendData(201, { product }, 'Product created successfully');

}

// fetch all the stored products from database
async function getProducts(req: Request, res: Response) {

    const response = await productService.getProducts();
    const products = response.data;

    return res.sendData(200, { products });

}

// fetch a single product
async function getProduct(req: Request, res: Response) {

    const productId = req.params.id;

    const result = productFetchValidator.safeParse(productId);

    if (!result.success) {
        res.sendErrors(400, result.error);
        return;
    }

    const response = await productService.getProduct(result.data);

    if (!response.success) {
        res.sendErrors(404, response.errors[0].message);
        return;
    }

    const product = response.data;

    return res.sendData(200, { product });

}

// delete a single product
async function deleteProduct(req: Request, res: Response) {

    const productId = req.params.id;

    const result = productDeleteValidator.safeParse(productId);

    if (!result.success) {
        res.sendErrors(400, result.error);
        return;
    }

    const response = await productService.deleteProduct(result.data);

    if (!response.success) {
        res.sendErrors(404, response.errors[0].message);
        return;
    }

    return res.sendMessage("Product deleted successfully");

}

// increase / decrease product quantity by given amount
async function updateProductQuantity(req: Request, res: Response) {

    const productId = req.params.id;
    const productQuantity = req.query.number;

    const result = productUpdateValidator.safeParse({ id: productId, number: productQuantity });

    if (!result.success) {
        res.sendErrors(400, result.error);
        return;
    }

    const data = result.data;

    const response = await productService.updateProductQuantity(data.id, data.number);

    if (!response.success) {
        res.sendErrors(404, response.errors[0].message);
        return;
    }

    const product = response.data;

    return res.sendData(200, { product }, 'Product updated successfully');


}


export { router };
