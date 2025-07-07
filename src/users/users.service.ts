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
    const users = await this.userRepository.find();
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
      queryBuilder.andWhere('JSON_CONTAINS(user.roles, :roles)', {
        roles: JSON.stringify(roles),
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search OR LOWER(user.email) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      users: users.map(({ ...user }) => user),
      total,
    };
  }

  async create(createUserDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      roles: createUserDto.roles || [UserRole.STUDENT], // Default role for new users
      status: UserStatus.ACTIVE, // Default status for new users
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
    // Assign other properties
    Object.assign(user, { ...updateUserDto, roles: undefined }); // Exclude roles from direct assign to avoid conflict
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
}
