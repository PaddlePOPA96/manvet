import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/product.entity";
import { StockMutation } from "./stock-mutation.entity";
import { StockMutationsController } from "./stock-mutations.controller";
import { StockMutationsService } from "./stock-mutations.service";

@Module({
  imports: [TypeOrmModule.forFeature([StockMutation, Product])],
  controllers: [StockMutationsController],
  providers: [StockMutationsService]
})
export class StockMutationsModule {}

