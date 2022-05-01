import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  public is_company: boolean = false;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;
}
