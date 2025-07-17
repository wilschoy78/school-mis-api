import { IsString, IsOptional, IsEnum, IsBoolean, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePositionDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['teaching', 'administrative', 'support'])
  category?: 'teaching' | 'administrative' | 'support';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePositionDto extends PartialType(CreatePositionDto) {}

export class PositionResponseDto {
  id: number;
  name: string;
  description?: string;
  category: 'teaching' | 'administrative' | 'support';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}