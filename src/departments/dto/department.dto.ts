import { IsString, IsOptional, IsEnum, IsBoolean, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDepartmentDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['academic', 'administrative', 'support'])
  category?: 'academic' | 'administrative' | 'support';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}

export class DepartmentResponseDto {
  id: number;
  name: string;
  description?: string;
  category: 'academic' | 'administrative' | 'support';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}