import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @Column({ type: 'text', nullable: true })
  public description: string | null;

  @Column({nullable: true })
  public education_level: string | null;

  @Column({ nullable: true })
  public work_location: string | null;

  @Column({ type: 'simple-array', nullable: true })
  public specializations: string | null[];

  @Column({ nullable: true })
  public expected_salary: string | null;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

}
