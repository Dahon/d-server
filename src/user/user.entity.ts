import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DatabaseFileEntity } from "./databaseFile.entity";
import { DatabaseVideoFileEntity } from "./databaseVideoFile.entity";

@Entity()
export class User {
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

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public avatarId?: number;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFileEntity, { nullable: true })
  public avatar: DatabaseFileEntity;

  @Column({ nullable: true })
  public videoId?: number;

  @JoinColumn({ name: 'videoId' })
  @OneToOne(() => DatabaseVideoFileEntity, { nullable: true })
  public video: DatabaseVideoFileEntity;




}
