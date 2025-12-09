import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Promotion } from "./promotion.entity";
import { PromotionProduct } from "./promotion-product.entity";

@Injectable()
export class PromotionsService {
    constructor(
        @InjectRepository(Promotion)
        private readonly promotionRepo: Repository<Promotion>,
        @InjectRepository(PromotionProduct)
        private readonly promotionProductRepo: Repository<PromotionProduct>
    ) { }

    async findAll(): Promise<Promotion[]> {
        return this.promotionRepo.find({
            relations: ["promotionProducts", "promotionProducts.product"],
            order: { createdAt: "DESC" }
        });
    }

    async create(data: {
        name: string;
        startDate: Date;
        endDate: Date;
        productPrices: Array<{ productId: number; eventPrice: number }>;
    }): Promise<Promotion> {
        const promotion = this.promotionRepo.create({
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            active: true
        });

        const savedPromotion = await this.promotionRepo.save(promotion);

        // Create promotion products
        const promotionProducts = data.productPrices.map((pp) =>
            this.promotionProductRepo.create({
                promotionId: savedPromotion.id,
                productId: pp.productId,
                eventPrice: pp.eventPrice
            })
        );

        await this.promotionProductRepo.save(promotionProducts);

        const result = await this.promotionRepo.findOne({
            where: { id: savedPromotion.id },
            relations: ["promotionProducts", "promotionProducts.product"]
        });

        if (!result) {
            throw new Error("Failed to create promotion");
        }

        return result;
    }

    async toggleActive(id: number): Promise<Promotion> {
        const promotion = await this.promotionRepo.findOne({ where: { id } });
        if (!promotion) {
            throw new Error("Promotion not found");
        }
        promotion.active = !promotion.active;
        return this.promotionRepo.save(promotion);
    }

    async delete(id: number): Promise<void> {
        await this.promotionRepo.delete(id);
    }
}
