import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/product.entity";
import { StockMutation } from "../stock-mutations/stock-mutation.entity";
import { Transaction } from "./transaction.entity";
import { TransactionItem } from "./transaction-item.entity";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      TransactionItem,
      StockMutation,
      Product
    ])
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}

