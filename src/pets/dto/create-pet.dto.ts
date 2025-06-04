import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['dog', 'cat', 'bird', 'rabbit', 'other'])
  species: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsNotEmpty()
  @IsEnum(['small', 'medium', 'large'])
  size: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  age: number;

  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsNotEmpty()
  @IsEnum(['available', 'adopted', 'pending'])
  status: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vaccinations?: string[];

  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean;

  @IsOptional()
  @IsString()
  location?: string;
} 