import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @Column({ type: 'varchar', nullable: true })
  public lastname: string | null;

  @Column({ type: 'varchar', nullable: true })
  public linkedin_link: string | null;

  @Column({ type: 'text', nullable: true })
  public description: string | null;

  @Column({ nullable: true })
  public start_date: string | null;

  @Column({ nullable: true })
  public employment_type: string | null;

  @Column({nullable: true })
  public education_level: string | null;

  @Column({ nullable: true })
  public work_location: string | null;

  @Column({ type: 'simple-array', nullable: true })
  public specializations: string | null[];

  @Column({nullable: true })
  public expected_salary: string | null;

  @Column({ type: 'bytea', nullable: true })
  public avatar: Buffer | null;

  @Column({ type: 'bytea', nullable: true })
  public poster: Buffer | null;

  @Column({ nullable: true })
  public avatar_src: string | null;

  @Column({ nullable: true })
  public poster_src: string | null;

  @Column({ nullable: true })
  public video: string | null;

  @Column({ nullable: true })
  public video_url: string | null;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
