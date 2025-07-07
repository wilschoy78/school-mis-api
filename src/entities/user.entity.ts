import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  REGISTRAR = 'registrar',
  TEACHER = 'teacher',
  STUDENT = 'student',
  LIBRARIAN = 'librarian',
  PARENT = 'parent',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'set',
    enum: UserRole,
    default: [UserRole.STAFF],
  })
  roles: UserRole[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true })
  employeeId: string;

  @Column({ nullable: true })
  studentId: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  department: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Helper method to get full name
  get fullName(): string {
    return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
  }
}
