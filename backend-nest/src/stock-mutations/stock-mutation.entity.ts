import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "../products/product.entity";

@Entity("StockMutation")
export class StockMutation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column({ nullable: true })
  type!: string;

  @Column({ nullable: true })
  condition!: string;

  @Column({ nullable: true })
  quantity!: number;

  @Column({ nullable: true })
  date!: Date;

  @Column({ type: "text", nullable: true })
  reseller!: string | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  productionDate!: Date | null;

  @Column()
  createdAt!: Date;
}
