import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities/position.entity';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  async findAll(category?: string, isActive?: boolean): Promise<Position[]> {
    const query = this.positionRepository.createQueryBuilder('position');
    
    if (category) {
      query.andWhere('position.category = :category', { category });
    }
    
    if (isActive !== undefined) {
      query.andWhere('position.isActive = :isActive', { isActive });
    }
    
    return query.orderBy('position.name', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository.findOne({ where: { id } });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    // Check if position name already exists
    const existingPosition = await this.positionRepository.findOne({
      where: { name: createPositionDto.name },
    });
    
    if (existingPosition) {
      throw new ConflictException('Position name already exists');
    }

    const position = this.positionRepository.create(createPositionDto);
    return this.positionRepository.save(position);
  }

  async update(id: number, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const position = await this.findOne(id);
    
    // Check if new name conflicts with existing position
    if (updatePositionDto.name && updatePositionDto.name !== position.name) {
      const existingPosition = await this.positionRepository.findOne({
        where: { name: updatePositionDto.name },
      });
      
      if (existingPosition) {
        throw new ConflictException('Position name already exists');
      }
    }

    Object.assign(position, updatePositionDto);
    return this.positionRepository.save(position);
  }

  async toggleActive(id: number): Promise<Position> {
    const position = await this.findOne(id);
    position.isActive = !position.isActive;
    return this.positionRepository.save(position);
  }
}