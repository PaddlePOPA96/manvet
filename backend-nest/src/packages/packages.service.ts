import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Package } from "./package.entity";
import { PackageItem } from "./package-item.entity";

@Injectable()
export class PackagesService {
    constructor(
        @InjectRepository(Package)
        private readonly packageRepo: Repository<Package>,
        @InjectRepository(PackageItem)
        private readonly packageItemRepo: Repository<PackageItem>
    ) { }

    async findAll(): Promise<Package[]> {
        return this.packageRepo.find({
            relations: ["packageItems", "packageItems.product"],
            order: { createdAt: "DESC" }
        });
    }

    async create(data: {
        name: string;
        price: number;
        items: Array<{ productId: number; quantity: number }>;
    }): Promise<Package> {
        const pkg = this.packageRepo.create({
            name: data.name,
            price: data.price
        });

        const savedPackage = await this.packageRepo.save(pkg);

        // Create package items
        const packageItems = data.items.map((item) =>
            this.packageItemRepo.create({
                packageId: savedPackage.id,
                productId: item.productId,
                quantity: item.quantity
            })
        );

        await this.packageItemRepo.save(packageItems);

        const result = await this.packageRepo.findOne({
            where: { id: savedPackage.id },
            relations: ["packageItems", "packageItems.product"]
        });

        if (!result) {
            throw new Error("Failed to create package");
        }

        return result;
    }

    async delete(id: number): Promise<void> {
        await this.packageRepo.delete(id);
    }
}
