import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";

@Entity("Role")
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: true, default: 'guest' })
  name!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
