import { Product } from "../products/product.entity";
export declare class StockMutation {
    id: number;
    productId: number;
    product: Product;
    type: string;
    condition: string;
    quantity: number;
    date: Date;
    reseller: string | null;
    productionDate: Date | null;
    createdAt: Date;
}
