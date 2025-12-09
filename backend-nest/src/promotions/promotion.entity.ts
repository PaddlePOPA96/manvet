import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { PromotionProduct } from "./promotion-product.entity";

@Entity("Promotion")
export class Promotion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: "timestamp" })
    startDate!: Date;

    @Column({ type: "timestamp" })
    endDate!: Date;

    @Column({ default: true })
    active!: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @OneToMany(() => PromotionProduct, (pp) => pp.promotion)
    promotionProducts!: PromotionProduct[];
}
