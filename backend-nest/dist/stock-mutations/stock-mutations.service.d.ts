import { Repository } from "typeorm";
import { StockMutation } from "./stock-mutation.entity";
import { CreateStockMutationDto } from "./dto/create-stock-mutation.dto";
export declare class StockMutationsService {
    private readonly repo;
    constructor(repo: Repository<StockMutation>);
    create(dto: CreateStockMutationDto): Promise<StockMutation>;
}
