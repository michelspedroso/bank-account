import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './../../config/mysql/base-entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    firstName: string;

    @Column({ type: 'varchar', length: 255 })
    lastName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;
  
    @Column({ type: 'varchar', length: 255 })
    password: string;
}