import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(ValidationPipe) createAdoptionDto: CreateAdoptionDto,
    @CurrentUser() user: any
  ) {
    return this.adoptionsService.create(createAdoptionDto, user.userId);
  }

  @Get()
  findAll() {
    return this.adoptionsService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.adoptionsService.getStatistics();
  }

  @Get('my-applications')
  @UseGuards(JwtAuthGuard)
  findMyApplications(@CurrentUser() user: any) {
    return this.adoptionsService.findByApplicant(user.userId);
  }

  @Get('my-pets-applications')
  @UseGuards(JwtAuthGuard)
  findMyPetsApplications(@CurrentUser() user: any) {
    return this.adoptionsService.findByOwner(user.userId);
  }

  @Get('applicant/:applicantId')
  findByApplicant(@Param('applicantId') applicantId: string) {
    return this.adoptionsService.findByApplicant(applicantId);
  }

  @Get('owner/:ownerId')
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.adoptionsService.findByOwner(ownerId);
  }

  @Get('pet/:petId')
  findByPet(@Param('petId') petId: string) {
    return this.adoptionsService.findByPet(petId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateAdoptionDto: UpdateAdoptionDto) {
    return this.adoptionsService.update(id, updateAdoptionDto);
  }

  @Patch(':id/complete')
  completeAdoption(@Param('id') id: string) {
    return this.adoptionsService.completeAdoption(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionsService.remove(id);
  }
} 