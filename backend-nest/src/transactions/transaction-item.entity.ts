import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Transaction } from "./transaction.entity";
import { Product } from "../products/product.entity";

@Entity("TransactionItem")
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  transactionId!: number;

  @Column({ type: "integer", nullable: true })
  productId!: number | null;

  @Column({ type: "integer", nullable: true })
  packageId!: number | null;

  @Column({ nullable: true })
  type!: string;

  @Column({ type: "integer" })
  qty!: number;

  @Column({ type: "integer" })
  basePrice!: number;

  @Column({ type: "integer" })
  price!: number;

  @Column({ type: "integer" })
  cost!: number;

  @Column({ type: "integer" })
  discountPerUnit!: number;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.items,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "transactionId" })
  transaction!: Transaction;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: "productId" })
  product!: Product | null;
}
