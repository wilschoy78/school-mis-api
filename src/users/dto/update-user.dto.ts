import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto/register.dto';
import { IsEnum, IsOptional, IsString, MinLength, IsDateString, IsNumber, IsPositive } from 'class-validator';
import { UserStatus } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  // Employee-specific fields
  @ApiProperty({ example: 'Senior Teacher', description: 'Employee position' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ example: '2023-01-15', description: 'Employee hire date' })
  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @ApiProperty({ example: 50000.00, description: 'Employee salary' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  salary?: number;

  @ApiProperty({ example: 'John Doe', description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({ example: '+1234567890', description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  emergencyPhone?: string;
}
