import { IsOptional, IsEnum, IsString } from 'class-validator';

export class UpdateAdoptionDto {
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'completed'])
  status?: string;

  @IsOptional()
  @IsString()
  ownerNotes?: string;

  @IsOptional()
  @IsString()
  message?: string;
} 