import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Role } from "./role.entity";
import { Transaction } from "../transactions/transaction.entity";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: true, default: 'guest@example.com' })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column()
  roleId!: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: "roleId" })
  role!: Role;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @OneToMany(
    () => Transaction,
    (tx) => tx.user
  )
  transactions!: Transaction[];
}

