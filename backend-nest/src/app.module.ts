import * as dotenv from "dotenv";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Product } from "./products/product.entity";
import { ProductsModule } from "./products/products.module";
import { Transaction } from "./transactions/transaction.entity";
import { TransactionItem } from "./transactions/transaction-item.entity";
import { StockMutation } from "./stock-mutations/stock-mutation.entity";
import { TransactionsModule } from "./transactions/transactions.module";
import { StockMutationsModule } from "./stock-mutations/stock-mutations.module";
import { User } from "./users/user.entity";
import { Role } from "./users/role.entity";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { Category } from "./categories/category.entity";
import { PromotionsModule } from "./promotions/promotions.module";
import { Promotion } from "./promotions/promotion.entity";
import { PromotionProduct } from "./promotions/promotion-product.entity";
import { PackagesModule } from "./packages/packages.module";
import { Package } from "./packages/package.entity";
import { PackageItem } from "./packages/package-item.entity";
import { FixNullService } from "./fix-null.service";

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      entities: [
        Product,
        Transaction,
        TransactionItem,
        StockMutation,
        User,
        Role,
        Category,
        Promotion,
        PromotionProduct,
        Package,
        PackageItem
      ],
      synchronize: false
    }),
    ProductsModule,
    TransactionsModule,
    StockMutationsModule,
    AuthModule,
    CategoriesModule,
    PromotionsModule,
    PackagesModule
  ],
  providers: [AppService, FixNullService], controllers: [AppController],

})
export class AppModule { }
