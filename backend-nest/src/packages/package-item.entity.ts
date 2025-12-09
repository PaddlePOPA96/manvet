import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Package } from "./package.entity";
import { Product } from "../products/product.entity";

@Entity("PackageItem")
export class PackageItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    packageId!: number;

    @Column()
    productId!: number;

    @Column({ default: 1 })
    quantity!: number;

    @ManyToOne(() => Package, (pkg) => pkg.packageItems, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "packageId" })
    package!: Package;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    product!: Product;
}
