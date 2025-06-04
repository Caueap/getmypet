import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @IsOptional()
  @IsEnum(['available', 'adopted', 'pending'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 