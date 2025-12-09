import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Promotion } from "./promotion.entity";
import { Product } from "../products/product.entity";

@Entity("PromotionProduct")
export class PromotionProduct {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    promotionId!: number;

    @Column()
    productId!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    eventPrice!: number;

    @ManyToOne(() => Promotion, (promotion) => promotion.promotionProducts, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "promotionId" })
    promotion!: Promotion;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    product!: Product;
}
