import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Position entity for managing employee positions dynamically
 * Supports categorization and soft deletion
 */
@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['teaching', 'administrative', 'support'],
    default: 'administrative',
  })
  category: 'teaching' | 'administrative' | 'support';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}