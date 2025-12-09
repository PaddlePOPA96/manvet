import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PromotionsService } from "./promotions.service";
import { Promotion } from "./promotion.entity";

@Controller("promotions")
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<Promotion[]> {
        return this.promotionsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body()
        body: {
            name: string;
            startDate: string;
            endDate: string;
            productPrices: Array<{ productId: number; eventPrice: number }>;
        }
    ): Promise<Promotion> {
        return this.promotionsService.create({
            name: body.name,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            productPrices: body.productPrices
        });
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id/toggle")
    toggleActive(@Param("id") id: string): Promise<Promotion> {
        return this.promotionsService.toggleActive(Number(id));
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        await this.promotionsService.delete(Number(id));
    }
}
