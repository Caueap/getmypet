import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdoptionDto {
  @IsNotEmpty()
  @IsString()
  petId: string;

  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
} 