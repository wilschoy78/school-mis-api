import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dto/register.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../../entities/user.entity';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
