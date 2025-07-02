import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Smith', description: 'User middle name', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: '09123456789', description: 'User phone number', required: false })
  @IsOptional()
  @IsPhoneNumber('PH')
  phone?: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'EMP-001', description: 'Employee ID', required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: 'STU-001', description: 'Student ID', required: false })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty({ example: '123 Main St, City', description: 'User address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '1990-01-01', description: 'User date of birth', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
