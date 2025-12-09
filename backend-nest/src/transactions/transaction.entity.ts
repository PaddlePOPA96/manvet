import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { TransactionItem } from "./transaction-item.entity";
import { User } from "../users/user.entity";

@Entity("Transaction")
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  date!: Date;

  @Column({ type: "integer", nullable: true })
  totalAmount!: number | null;

  @Column()
  createdAt!: Date;

  @OneToMany(
    () => TransactionItem,
    (item) => item.transaction,
    { cascade: ["insert"] }
  )
  items!: TransactionItem[];
}
