import { TransactionItem } from "./transaction-item.entity";
import { User } from "../users/user.entity";
export declare class Transaction {
    id: number;
    userId: number;
    user: User;
    date: Date;
    totalAmount: number | null;
    createdAt: Date;
    items: TransactionItem[];
}
