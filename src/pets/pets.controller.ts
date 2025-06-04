import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@Body(ValidationPipe) createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get()
  findAll(
    @Query('species') species?: string,
    @Query('size') size?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    const filters: any = {};
    if (species) filters.species = species;
    if (size) filters.size = size;
    if (location) filters.location = location;
    if (status) filters.status = status;

    return this.petsService.findAll(filters);
  }

  @Get('available')
  findAvailable(
    @Query('species') species?: string,
    @Query('size') size?: string,
    @Query('location') location?: string,
  ) {
    const filters: any = {};
    if (species) filters.species = species;
    if (size) filters.size = size;
    if (location) filters.location = location;

    return this.petsService.findAvailable(filters);
  }

  @Get('owner/:ownerId')
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.petsService.findByOwner(ownerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updatePetDto: UpdatePetDto) {
    return this.petsService.update(id, updatePetDto);
  }

  @Patch(':id/adopt/:adopterId')
  adoptPet(@Param('id') petId: string, @Param('adopterId') adopterId: string) {
    return this.petsService.adoptPet(petId, adopterId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
} 