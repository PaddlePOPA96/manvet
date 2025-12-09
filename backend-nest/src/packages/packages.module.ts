import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Package } from "./package.entity";
import { PackageItem } from "./package-item.entity";
import { PackagesController } from "./packages.controller";
import { PackagesService } from "./packages.service";

@Module({
    imports: [TypeOrmModule.forFeature([Package, PackageItem])],
    controllers: [PackagesController],
    providers: [PackagesService]
})
export class PackagesModule { }
