import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../products/product.entity";
import { StockMutation } from "../stock-mutations/stock-mutation.entity";
import { Transaction } from "./transaction.entity";
import { TransactionItem } from "./transaction-item.entity";
import {
  CreateTransactionDto,
  TransactionItemInput
} from "./dto/create-transaction.dto";

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

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private readonly itemRepo: Repository<TransactionItem>,
    @InjectRepository(StockMutation)
    private readonly mutationRepo: Repository<StockMutation>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async findFlat(): Promise<FlatTransaction[]> {
    const [txs, mutations] = await Promise.all([
      this.txRepo.find({
        order: { date: "DESC" },
        relations: ["items", "items.product"]
      }),
      this.mutationRepo.find({
        order: { date: "DESC" },
        relations: ["product"]
      })
    ]);

    const flat: FlatTransaction[] = [];

    for (const tx of txs) {
      const txDate = tx.date;
      const dateStr = txDate.toISOString().split("T")[0];
      const timestamp = txDate.toISOString();

      for (const item of tx.items) {
        const productName = item.product?.name || "Unknown";

        flat.push({
          id: item.id,
          date: dateStr,
          timestamp,
          type: "OUT",
          product: productName,
          quantity: item.qty,
          condition: "SALE",
          reseller: "POS",
          cost: item.cost,
          price: item.price,
          productionDate: ""
        });
      }
    }

    for (const m of mutations) {
      const dateStr = m.date.toISOString().split("T")[0];
      const timestamp = m.date.toISOString();

      flat.push({
        id: `M-${m.id}`,
        date: dateStr,
        timestamp,
        type: m.type as "IN" | "OUT",
        product: m.product?.name || "Unknown",
        quantity: m.quantity,
        condition: m.condition,
        reseller: m.reseller || "",
        cost: m.product?.cost || 0,
        price: m.product?.price || 0,
        productionDate: m.productionDate
          ? m.productionDate.toISOString().split("T")[0]
          : ""
      });
    }

    return flat;
  }

  private mapItemInput(input: TransactionItemInput): Partial<TransactionItem> {
    const qty = Number(input.qty ?? input.quantity ?? 0);
    const basePrice = Number.isFinite(input.basePrice as number)
      ? (input.basePrice as number)
      : Number(input.price) || 0;
    const price = Number(input.price) || 0;
    const cost = Number(input.cost) || 0;

    const discountPerUnit =
      input.discountPerUnit != null &&
      Number.isFinite(input.discountPerUnit as number)
        ? (input.discountPerUnit as number)
        : basePrice - price;

    return {
      type: input.type || "ITEM",
      qty,
      basePrice,
      price,
      cost,
      discountPerUnit,
      productId:
        input.productId != null ? Number(input.productId) : null,
      packageId:
        input.packageId != null ? Number(input.packageId) : null
    };
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    if (!dto.items || dto.items.length === 0) {
      throw new Error("Payload harus berisi array 'items'.");
    }

    const txDate = dto.date ? new Date(dto.date) : new Date();

    const mappedItems = dto.items.map((item) =>
      this.mapItemInput(item)
    );

    const totalAmount = mappedItems.reduce(
      (sum, it) => sum + (it.price || 0) * (it.qty || 0),
      0
    );

    const entity = this.txRepo.create({
      userId: dto.userId || 1,
      date: txDate,
      totalAmount,
      items: mappedItems as TransactionItem[]
    });

    return this.txRepo.save(entity);
  }
}

