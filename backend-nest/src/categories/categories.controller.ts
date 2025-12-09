import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly service: CategoriesService) { }

    @Get()
    getAll(): Promise<Category[]> {
        return this.service.findAll();
    }

    @Post()
    create(@Body() body: { name: string }): Promise<Category> {
        return this.service.create(body.name);
    }

    @Delete(":id")
    remove(@Param("id") id: string): Promise<void> {
        return this.service.remove(Number(id));
    }
}
