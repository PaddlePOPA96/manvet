import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly repo: Repository<Category>
    ) { }

    findAll(): Promise<Category[]> {
        return this.repo.find({ order: { name: "ASC" } });
    }

    async create(name: string): Promise<Category> {
        const existing = await this.repo.findOne({ where: { name } });
        if (existing) return existing;
        const cat = this.repo.create({ name });
        return this.repo.save(cat);
    }

    async remove(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}
