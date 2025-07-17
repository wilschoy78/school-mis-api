import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Query,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '../entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'roles', required: false, enum: UserRole, isArray: true })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('roles') roles?: UserRole[] | 'all' | string,
    @Query('search') search?: string,
  ) {
    // Parse roles if it's a JSON string
    let parsedRoles: UserRole[] | 'all' = 'all'; // Default to 'all'
    
    if (roles === 'all' || !roles) {
      parsedRoles = 'all';
    } else if (typeof roles === 'string') {
      try {
        parsedRoles = JSON.parse(roles);
      } catch (e) {
        // If parsing fails, treat as 'all'
        parsedRoles = 'all';
      }
    } else {
      parsedRoles = roles as UserRole[];
    }
    
    return this.usersService.findAllPaginated(page, limit, parsedRoles, search);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.REGISTRAR)
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiResponse({ status: 200, description: 'Return a single user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'User status successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: UserStatus,
  ) {
    return this.usersService.updateUserStatus(id, status);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserDto: RegisterDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'User password successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updatePassword(
    @Param('id') id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto.password);
  }

  // Employee-specific endpoints
  @Get('employees/list')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all employees with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiQuery({ name: 'position', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return all employees.' })
  async findAllEmployees(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('department') department?: string,
    @Query('position') position?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAllEmployees(page, limit, department, position, search);
  }

  @Get('employees/stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get employee statistics' })
  @ApiResponse({ status: 200, description: 'Return employee statistics.' })
  async getEmployeeStats() {
    return this.usersService.getEmployeeStats();
  }
}
