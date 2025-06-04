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
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(ValidationPipe) createPetDto: CreatePetDto,
    @CurrentUser() user: any
  ) {
    return this.petsService.create(createPetDto, user.userId);
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

  @Get('my-pets')
  @UseGuards(JwtAuthGuard)
  findMyPets(@CurrentUser() user: any) {
    return this.petsService.findByOwner(user.userId);
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
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
} 