import { Repository } from "typeorm";
import { Product } from "./product.entity";
export declare class ProductsService {
    private readonly repo;
    constructor(repo: Repository<Product>);
    findAll(): Promise<Product[]>;
    create(data: Partial<Product>): Promise<Product>;
    update(id: number, data: Partial<Product>): Promise<Product>;
    remove(id: number): Promise<void>;
}
