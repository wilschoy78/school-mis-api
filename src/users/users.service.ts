import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('NOT FIND_IN_SET(:role, user.roles)', {
        role: UserRole.SUPER_ADMIN,
      })
      .getMany();
    return users.map(({ ...user }) => user);
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserStatus(
    id: number,
    status: UserStatus,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    await this.userRepository.save(user);

    const { ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAllPaginated(
    page: number,
    limit: number,
    roles?: UserRole[] | 'all',
    search?: string,
  ): Promise<{ users: Partial<User>[]; total: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (roles && roles !== 'all' && roles.length > 0) {
      // Use a more reliable approach for role filtering
      const roleConditions = roles.map((role, index) => `FIND_IN_SET(:role${index}, user.roles) > 0`);
      const roleParams: any = {};
      roles.forEach((role, index) => {
        roleParams[`role${index}`] = role;
      });
      
      queryBuilder.andWhere(`(${roleConditions.join(' OR ')})`, roleParams);
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search OR LOWER(user.email) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    queryBuilder.andWhere('NOT FIND_IN_SET(:role, user.roles)', {
      role: UserRole.SUPER_ADMIN,
    });

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      users: users.map(({ ...user }) => user),
      total,
    };
  }

  async create(
    createUserDto: RegisterDto & { password?: string },
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const password = createUserDto.password || 'new.user.pass';

    const newUser = this.userRepository.create({
      ...createUserDto,
      password,
      roles: createUserDto.roles || [UserRole.STAFF],
      status: UserStatus.ACTIVE,
    });

    return this.userRepository.save(newUser);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUserWithEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUserWithEmail && existingUserWithEmail.id !== id) {
        throw new ConflictException('Email already in use by another user');
      }
    }

    // Ensure roles are handled correctly, if provided
    if (updateUserDto.roles) {
      user.roles = updateUserDto.roles;
    }

    if (updateUserDto.password) {
      user.password = updateUserDto.password;
      await user.hashPassword();
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    const { ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async updatePassword(
    id: number,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.hashPassword();
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }
}
