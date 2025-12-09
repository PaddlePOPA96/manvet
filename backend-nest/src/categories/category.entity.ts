import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Category")
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;
}
