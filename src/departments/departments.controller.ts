import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  findAll(
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.departmentsService.findAll(category, isActiveBoolean);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.toggleActive(id);
  }
}