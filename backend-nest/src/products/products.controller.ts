import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Product } from "./product.entity";
import { ProductsService } from "./products.service";
import { Category } from "../categories/category.entity";

@Controller("products")
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>
  ) { }

  @Get()
  getAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    body: {
      name: string;
      price: number;
      cost: number;
      photoUrl?: string | null;
      packageInfo?: string | null;
      category?: string | null;
      categoryId?: number | null;
      unit?: string | null;
    }
  ): Promise<Product> {
    let categoryId = body.categoryId ?? null;

    // If category name provided, convert to categoryId
    if (body.category && !categoryId) {
      const cat = await this.categoryRepo.findOne({ where: { name: body.category } });
      categoryId = cat?.id ?? null;
    }

    return this.productsService.create({
      name: body.name,
      price: Number(body.price),
      cost: Number(body.cost),
      photoUrl: body.photoUrl ?? null,
      packageInfo: body.packageInfo ?? null,
      categoryId,
      unit: body.unit ?? null
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body()
    body: {
      name?: string;
      price?: number;
      cost?: number;
      photoUrl?: string | null;
      packageInfo?: string | null;
      category?: string | null;
      categoryId?: number | null;
      unit?: string | null;
    }
  ): Promise<Product> {
    let categoryId = body.categoryId ?? undefined;

    // If category name provided, convert to categoryId
    if (body.category && categoryId === undefined) {
      const cat = await this.categoryRepo.findOne({ where: { name: body.category } });
      categoryId = cat?.id ?? null;
    }

    return this.productsService.update(Number(id), {
      name: body.name,
      price: body.price != null ? Number(body.price) : undefined,
      cost: body.cost != null ? Number(body.cost) : undefined,
      photoUrl: body.photoUrl ?? null,
      packageInfo: body.packageInfo ?? null,
      categoryId,
      unit: body.unit ?? null
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    await this.productsService.remove(Number(id));
  }
}
