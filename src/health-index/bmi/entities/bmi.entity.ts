import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UsersEntity } from "src/auth/users/entities/users.entity";
import { BMI_CATEGORY } from "../bmi.const";
import { BeforeInsert, BeforeUpdate } from "typeorm";

@Entity("bmi_records")
export class BmiEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "float", nullable: false })
  height: number; // in meters

  @Column({ type: "float", nullable: false })
  weight: number; // in kilograms

  @Column({
    type: "float",
    nullable: false,
  })
  bmi_value: number;

  @Column({
    type: "enum",
    enum: BMI_CATEGORY,
    nullable: false
  })
  bmi_category: BMI_CATEGORY;

  @Column({ name: 'owner_id', type: 'uuid', nullable: false })
  owner_id: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'owner_id' })
  owner: UsersEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateBmiCategory() {
    this.bmi_value = this.weight / (this.height * this.height);
    if (this.bmi_value < 18.5) this.bmi_category = BMI_CATEGORY.UNDERWEIGHT;
    else if (this.bmi_value < 25) this.bmi_category = BMI_CATEGORY.NORMAL;
    else if (this.bmi_value < 30) this.bmi_category = BMI_CATEGORY.OVERWEIGHT;
    else if (this.bmi_value < 35) this.bmi_category = BMI_CATEGORY.OBESE;
    else if (this.bmi_value < 40) this.bmi_category = BMI_CATEGORY.OBESE_II;
    else this.bmi_category = BMI_CATEGORY.OBESE_III;
  }
}
