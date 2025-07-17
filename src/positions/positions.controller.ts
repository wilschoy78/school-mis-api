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
import { PositionsService } from './positions.service';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('positions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  findAll(
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.positionsService.findAll(category, isActiveBoolean);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.positionsService.toggleActive(id);
  }
}