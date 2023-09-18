// data transfer objects
export interface ProductCreationDto {
    name: string;
    quantity: number;
}

export type ProductDto = ProductCreationDto & { id: string }
