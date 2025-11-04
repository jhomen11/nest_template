import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('text', { unique: true })
  username: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullName: string;

  @Column('boolean', { default: true })
  isActive: boolean;


  @Column('text', { array: true, default: ['user'] })
  roles: string[];
}