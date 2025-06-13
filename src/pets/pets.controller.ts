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
  UseInterceptors,
  UploadedFiles,
  ForbiddenException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadService } from '../infrastructure/upload.service';

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

  @Post('migrate-original-owner')
  async migrateOriginalOwner() {
    await this.petsService.migrateOriginalOwner();
    return { message: 'Migration completed successfully' };
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

  @Post(':id/photos')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('photos', 5, UploadService.getMulterOptions('pets')))
  async uploadPhotos(
    @Param('id') petId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }
    
    const imageUrls = files.map(file => UploadService.getImageUrl(file.filename, 'pets'));
    
    const pet = await this.petsService.findOne(petId);
    if (!pet) {
      throw new Error('Pet not found');
    }
    
    const updatedImages = [...(pet.images || []), ...imageUrls];
    await this.petsService.update(petId, { images: updatedImages });
    
    return {
      message: 'Photos uploaded successfully',
      imageUrls,
    };
  }

  @Patch(':id/adopt/:adopterId')
  adoptPet(@Param('id') petId: string, @Param('adopterId') adopterId: string) {
    return this.petsService.adoptPet(petId, adopterId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    console.log(`Attempting to delete pet ${id} by user:`, JSON.stringify(user, null, 2));
    
    const pet = await this.petsService.findOne(id);
    console.log(`Found pet: ${pet.name}`);
    console.log(`Pet ownerId type: ${typeof pet.ownerId}, value:`, pet.ownerId);
    console.log(`User userId type: ${typeof user.userId}, value:`, user.userId);
    
    let petOwnerIdString: string;
    if (typeof pet.ownerId === 'object' && pet.ownerId._id) {
      petOwnerIdString = pet.ownerId._id.toString();
    } else {
      petOwnerIdString = pet.ownerId.toString();
    }
    
    const userIdString = user.userId.toString();
    
    console.log(`Pet owner ID as string: "${petOwnerIdString}"`);
    console.log(`User ID as string: "${userIdString}"`);
    console.log(`Are they equal? ${petOwnerIdString === userIdString}`);
    
    if (petOwnerIdString !== userIdString) {
      console.log('Ownership check failed - user is not the owner');
      throw new ForbiddenException('You can only delete your own pets');
    }
    
    console.log('Ownership check passed - proceeding with deletion');
    const result = await this.petsService.remove(id);
    console.log('Pet deletion completed successfully');
    return result;
  }
} 