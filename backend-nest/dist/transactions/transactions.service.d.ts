import { Repository } from "typeorm";
import { Product } from "../products/product.entity";
import { StockMutation } from "../stock-mutations/stock-mutation.entity";
import { Transaction } from "./transaction.entity";
import { TransactionItem } from "./transaction-item.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
export interface FlatTransaction {
    id: number | string;
    date: string;
    timestamp: string;
    type: "IN" | "OUT";
    product: string;
    quantity: number;
    condition: string;
    reseller: string;
    cost: number;
    price: number;
    productionDate: string;
}
export declare class TransactionsService {
    private readonly txRepo;
    private readonly itemRepo;
    private readonly mutationRepo;
    private readonly productRepo;
    constructor(txRepo: Repository<Transaction>, itemRepo: Repository<TransactionItem>, mutationRepo: Repository<StockMutation>, productRepo: Repository<Product>);
    findFlat(): Promise<FlatTransaction[]>;
    private mapItemInput;
    create(dto: CreateTransactionDto): Promise<Transaction>;
}
