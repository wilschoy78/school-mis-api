import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async findAll(category?: string, isActive?: boolean): Promise<Department[]> {
    const query = this.departmentRepository.createQueryBuilder('department');
    
    if (category) {
      query.andWhere('department.category = :category', { category });
    }
    
    if (isActive !== undefined) {
      query.andWhere('department.isActive = :isActive', { isActive });
    }
    
    return query.orderBy('department.name', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    // Check if department name already exists
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name: createDepartmentDto.name },
    });
    
    if (existingDepartment) {
      throw new ConflictException('Department name already exists');
    }

    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    
    // Check if new name conflicts with existing department
    if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { name: updateDepartmentDto.name },
      });
      
      if (existingDepartment) {
        throw new ConflictException('Department name already exists');
      }
    }

    Object.assign(department, updateDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async toggleActive(id: number): Promise<Department> {
    const department = await this.findOne(id);
    department.isActive = !department.isActive;
    return this.departmentRepository.save(department);
  }
}