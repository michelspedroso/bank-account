import { PrimaryGeneratedColumn, Column } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: Date, default: null, nullable: true })
  updatedAt: Date;
}
