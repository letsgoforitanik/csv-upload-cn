import { Product } from "@/models";
import { ProductCreationDto, ProductDto } from "@/types/dto";

export async function createProduct(info: ProductCreationDto): Promise<SuccessResult<ProductDto>> {

    const product = await Product.create(info);

    return {
        success: true,
        data: {
            id: product.id,
            name: product.name,
            quantity: product.quantity
        }
    };
}

export async function getProducts(): Promise<SuccessResult<ProductDto[]>> {

    const products = await Product.find().sort('-updatedAt');

    return {
        success: true,
        data: products.map(product => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity
        }))
    };

}


export async function getProduct(productId: string): Promise<Result<ProductDto>> {

    const product = await Product.findById(productId);

    if (!product) {
        return {
            success: false,
            errors: [{ message: 'Product not found' }]
        }
    }

    return {
        success: true,
        data: {
            id: product.id,
            name: product.name,
            quantity: product.quantity
        }
    }

}


export async function deleteProduct(productId: string): Promise<Result<null>> {

    const product = await Product.findById(productId);

    if (!product) {
        return {
            success: false,
            errors: [{ message: 'Product not found' }]
        }
    }

    await product.deleteOne();
    return { success: true, data: null };

}


export async function updateProductQuantity(productId: string, quantity: number): Promise<Result<ProductDto>> {

    const product = await Product.findById(productId);

    if (!product) {
        return {
            success: false,
            errors: [{ message: 'Product not found' }]
        }
    }

    product.quantity += quantity;
    await product.save();

    return {
        success: true,
        data: {
            id: product.id,
            name: product.name,
            quantity: product.quantity
        }
    };

}