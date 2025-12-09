import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Category } from "../categories/category.entity";

@Entity("Product")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ type: "integer" })
  price!: number;

  @Column({ type: "integer" })
  cost!: number;

  @Column({ name: "photo_url", type: "text", nullable: true })
  photoUrl!: string | null;

  @Column({ name: "package_info", type: "text", nullable: true })
  packageInfo!: string | null;

  @Column({ nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: "categoryId" })
  category!: Category | null;

  @Column({ type: "text", nullable: true })
  unit!: string | null;
}

