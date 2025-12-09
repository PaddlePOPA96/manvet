import { ProductsService } from "./products.service";
import { Product } from "./product.entity";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAll(): Promise<Product[]>;
    create(body: {
        name: string;
        price: number;
        cost: number;
        photoUrl?: string | null;
        packageInfo?: string | null;
    }): Promise<Product>;
    update(id: string, body: {
        name?: string;
        price?: number;
        cost?: number;
        photoUrl?: string | null;
        packageInfo?: string | null;
    }): Promise<Product>;
    remove(id: string): Promise<void>;
}
