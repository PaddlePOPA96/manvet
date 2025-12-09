import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PackagesService } from "./packages.service";
import { Package } from "./package.entity";

@Controller("packages")
export class PackagesController {
    constructor(private readonly packagesService: PackagesService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<Package[]> {
        return this.packagesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body()
        body: {
            name: string;
            price: number;
            items: Array<{ productId: number; quantity: number }>;
        }
    ): Promise<Package> {
        return this.packagesService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        await this.packagesService.delete(Number(id));
    }
}
