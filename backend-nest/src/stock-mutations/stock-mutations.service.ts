import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StockMutation } from "./stock-mutation.entity";
import { CreateStockMutationDto } from "./dto/create-stock-mutation.dto";

@Injectable()
export class StockMutationsService {
  constructor(
    @InjectRepository(StockMutation)
    private readonly repo: Repository<StockMutation>
  ) {}

  async create(dto: CreateStockMutationDto): Promise<StockMutation> {
    if (
      !dto.productId ||
      !dto.type ||
      !dto.condition ||
      !dto.quantity ||
      !dto.date
    ) {
      throw new Error(
        "Field 'productId', 'type', 'condition', 'quantity', dan 'date' wajib diisi."
      );
    }

    const parsedDate = new Date(dto.date);
    const parsedProdDate =
      dto.productionDate && dto.productionDate !== ""
        ? new Date(dto.productionDate)
        : null;

    const entity = this.repo.create({
      productId: Number(dto.productId),
      type: dto.type,
      condition: dto.condition,
      quantity: Number(dto.quantity),
      date: parsedDate,
      reseller: dto.reseller || null,
      productionDate: parsedProdDate
    });

    return this.repo.save(entity);
  }
}

