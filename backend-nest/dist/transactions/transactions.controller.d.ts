import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionsService } from "./transactions.service";
export declare class TransactionsController {
    private readonly service;
    constructor(service: TransactionsService);
    getAllFlat(): Promise<import("./transactions.service").FlatTransaction[]>;
    create(body: CreateTransactionDto): Promise<import("./transaction.entity").Transaction>;
}
