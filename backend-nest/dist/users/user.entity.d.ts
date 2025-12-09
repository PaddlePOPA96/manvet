import { Role } from "./role.entity";
import { Transaction } from "../transactions/transaction.entity";
export declare class User {
    id: number;
    email: string;
    password: string;
    roleId: number;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    transactions: Transaction[];
}
