import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserSeedService } from './seeds/user-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class DatabaseModule {}
