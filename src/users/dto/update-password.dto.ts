import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'The new password for the user',
    minLength: 8,
    example: 'newSecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
