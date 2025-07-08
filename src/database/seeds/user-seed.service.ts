import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class UserSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    const superAdminExists = await this.userRepository
      .createQueryBuilder('user')
      .where('FIND_IN_SET(:role, user.roles)', { role: UserRole.SUPER_ADMIN })
      .getOne();

    if (!superAdminExists) {
      const superAdmin = this.userRepository.create({
        email: 'admin@super.com',
        password: 'super.admin.pass',
        firstName: 'Super',
        lastName: 'Admin',
        roles: [UserRole.SUPER_ADMIN],
        mustChangePassword: false,
      });
      await this.userRepository.save(superAdmin);
    }
  }
}
