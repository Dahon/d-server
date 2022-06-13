import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @Column({nullable: true })
  public education_level: string;

  @Column({ nullable: true })
  public work_location: string;

  @Column({ type: 'simple-array', nullable: true })
  public specializations: string[];

  @Column({ nullable: true })
  public expected_salary: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

}
