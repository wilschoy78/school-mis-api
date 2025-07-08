import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto/register.dto';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserStatus } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
