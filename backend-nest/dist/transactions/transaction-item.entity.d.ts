import { Transaction } from "./transaction.entity";
import { Product } from "../products/product.entity";
export declare class TransactionItem {
    id: number;
    transactionId: number;
    productId: number | null;
    packageId: number | null;
    type: string;
    qty: number;
    basePrice: number;
    price: number;
    cost: number;
    discountPerUnit: number;
    transaction: Transaction;
    product: Product | null;
}
