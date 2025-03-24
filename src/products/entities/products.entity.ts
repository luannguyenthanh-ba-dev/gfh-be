import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductCurrencies } from "../products.const";

@Entity("products")
export class ProductsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "float", nullable: false })
  price: number;

  @Column({ type: "enum", enum: ProductCurrencies, nullable: false })
  currency: ProductCurrencies;

  @Column({ type: "varchar", nullable: false })
  brand: string;

  @Column({ type: "int", nullable: false })
  stock: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
