import { CreateStockMutationDto } from "./dto/create-stock-mutation.dto";
import { StockMutationsService } from "./stock-mutations.service";
export declare class StockMutationsController {
    private readonly service;
    constructor(service: StockMutationsService);
    create(body: CreateStockMutationDto): Promise<import("./stock-mutation.entity").StockMutation>;
}
