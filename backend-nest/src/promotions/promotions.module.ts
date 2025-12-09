import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Promotion } from "./promotion.entity";
import { PromotionProduct } from "./promotion-product.entity";
import { PromotionsController } from "./promotions.controller";
import { PromotionsService } from "./promotions.service";

@Module({
    imports: [TypeOrmModule.forFeature([Promotion, PromotionProduct])],
    controllers: [PromotionsController],
    providers: [PromotionsService]
})
export class PromotionsModule { }
