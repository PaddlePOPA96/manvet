import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>
  ) { }

  findAll(): Promise<Product[]> {
    return this.repo.find({
      relations: ["category"],
      order: { name: "ASC" }
    });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.repo.update({ id }, data);
    const updated = await this.repo.findOne({ where: { id } });
    if (!updated) {
      throw new Error("Product not found after update");
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete({ id });
  }
}

